import { Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { FeedbackEntity } from "../../entity/feedback.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { PlayerFeedbackEntity } from "../../entity/player-feedback.entity";
import { PlayerFeedbackOptionResultEntity } from "../../entity/player-feedback-option-result.entity";
import { SubmittedFeedbackOptionDto } from "./feedback.dto";
import { EventBus } from "@nestjs/cqrs";
import { FeedbackCreatedEvent } from "./event/feedback-created.event";
import { FeedbackOptionEntity } from "../../entity/feedback-option.entity";
import { ThreadType } from "../../gateway/shared-types/thread-type";
import { CurrentUserDto } from "../../utils/decorator/current-user";
import { ForumApi } from "../../generated-api/forum";
import { FeedbackAssistantService } from "./feedback-assistant.service";
import { Role } from "../../gateway/shared-types/roles";
import { AmqpConnection } from "@golevelup/nestjs-rabbitmq";

@Injectable()
export class FeedbackService implements OnApplicationBootstrap {
  constructor(
    private readonly datasource: DataSource,
    @InjectRepository(FeedbackEntity)
    private readonly feedbackEntityRepository: Repository<FeedbackEntity>,
    @InjectRepository(PlayerFeedbackEntity)
    private readonly playerFeedbackEntityRepository: Repository<PlayerFeedbackEntity>,
    @InjectRepository(PlayerFeedbackOptionResultEntity)
    private readonly playerFeedbackOptionResultEntityRepository: Repository<PlayerFeedbackOptionResultEntity>,
    @InjectRepository(FeedbackOptionEntity)
    private readonly feedbackOptionEntityRepository: Repository<FeedbackOptionEntity>,
    private readonly ebus: EventBus,
    private readonly forumApi: ForumApi,
    private readonly feedbackAssistant: FeedbackAssistantService,
    private readonly amqpConnection: AmqpConnection,
  ) {}

  public async createFeedbackForPlayer(
    feedbackTag: string,
    steamId: string,
  ): Promise<PlayerFeedbackEntity> {
    const feedback = await this.datasource.transaction(async (em) => {
      const fb = await em.findOne<FeedbackEntity>(FeedbackEntity, {
        where: {
          tag: feedbackTag,
        },
        relations: ["options"],
      });

      let playerFeedback = new PlayerFeedbackEntity(fb.tag, steamId);
      playerFeedback = await em.save(PlayerFeedbackEntity, playerFeedback);

      playerFeedback.optionResults = await em.save(
        PlayerFeedbackOptionResultEntity,
        fb.options.map(
          (option) =>
            new PlayerFeedbackOptionResultEntity(
              playerFeedback.id,
              option.option,
            ),
        ),
      );

      return playerFeedback;
    });

    await this.amqpConnection.publish(
      "app.events",
      FeedbackCreatedEvent.name,
      new FeedbackCreatedEvent(feedback.id, steamId),
    );

    return feedback;
  }

  async onApplicationBootstrap() {
    // const fb = await this.createFeedbackForPlayer(1, "116514945");
    // console.log(fb);
  }

  public async getFeedback(
    id: number,
    steamId: string,
  ): Promise<PlayerFeedbackEntity> {
    return this.playerFeedbackEntityRepository.findOneOrFail({
      where: {
        id,
        steamId,
      },
    });
  }

  async submitFeedbackResult(
    feedbackId: number,
    options: SubmittedFeedbackOptionDto[],
    comment: string,
    steamId: string,
    createTicket: boolean,
    user: CurrentUserDto,
  ): Promise<[PlayerFeedbackEntity, string | undefined]> {
    const feedback = await this.datasource.transaction<PlayerFeedbackEntity>(
      async (em) => {
        const playerFeedback =
          await this.playerFeedbackEntityRepository.findOneOrFail({
            where: { id: feedbackId, finished: false, steamId: steamId },
          });

        // Update checks
        await Promise.all(
          playerFeedback.optionResults.map(async (option) => {
            await em.update(
              PlayerFeedbackOptionResultEntity,
              {
                playerFeedbackId: option.playerFeedbackId,
                id: option.id,
              },
              {
                checked:
                  options.find((it) => it.id === option.id)?.checked || false,
              },
            );
          }),
        );

        // Update stuff
        playerFeedback.finished = true;
        playerFeedback.comment = comment;

        await em.update(
          PlayerFeedbackEntity,
          {
            id: feedbackId,
          },
          {
            finished: true,
            comment: comment,
          },
        );

        return em.findOne(PlayerFeedbackEntity, {
          where: {
            id: feedbackId,
          },
        });
      },
    );

    let ticketId: string | undefined = undefined;
    if (createTicket) {
      ticketId = await this.handleCreateTicket(
        feedback,
        user,
        options,
        comment,
      );
    }

    return [feedback, ticketId];
  }

  private async handleCreateTicket(
    feedback: PlayerFeedbackEntity,
    user: CurrentUserDto,
    options: SubmittedFeedbackOptionDto[],
    comment: string,
  ) {
    const thread = await this.forumApi.forumControllerGetThreadForKey({
      threadType: ThreadType.TICKET,
      externalId: feedback.id.toString(),
      title: `Тикет ${feedback.id}: ${feedback.feedback.title}`,
      op: feedback.steamId,
    });
    const msg = await this.forumApi.forumControllerPostMessage(thread.id, {
      author: user,
      content: `
${options
  .filter((it) => it.checked)
  .map((opt) => `- ${opt.option}`)
  .join("\n")}
Комментарий:
${comment}
        `,
    });

    // this.ebus.publish(
    //   new PlayerFeedbackThreadCreatedEvent(
    //     thread.id,
    //     user.steam_id,
    //     thread.title,
    //   ),
    // );

    const response = await this.feedbackAssistant
      .getGptResponse(`Ответ пользователя на вопрос ${feedback.feedback.title}:
    Возникшие проблемы: ${options
      .filter((it) => it.checked)
      .map((it) => it.option)
      .join(", ")}
    Комментарий: ${comment || "Без комментария"}.
    Подскажи, как можно решить проблему пользователя, ответ формулируй, как будто объясняешь пользователю, а не мне.`);

    console.log(response);

    await this.forumApi.forumControllerPostMessage(thread.id, {
      author: {
        steam_id: "159907143",
        roles: [Role.ADMIN],
      },
      content: response?.unknown
        ? "Не могу выдать быстрый ответ. Спроси в чате или ожидай ответа от администрации"
        : response?.answer || "Неизвестная ошибка",
    });

    return thread.id;
  }

  async updateFeedback(id: number, title: string, tag: string) {
    const fe = await this.feedbackEntityRepository.findOneOrFail({
      where: {
        id,
      },
      relations: ["options"],
    });

    fe.title = title;
    fe.tag = tag;

    return this.feedbackEntityRepository.save(fe);
  }

  async createFeedbackOption(id: number, option: string) {
    let nOption = await this.feedbackOptionEntityRepository.save(
      new FeedbackOptionEntity(option, id),
    );

    return await this.feedbackEntityRepository.findOneOrFail({
      where: { id },
      relations: ["options"],
    });
  }

  async editFeedbackOption(feedbackId: number, id: number, option: string) {
    await this.feedbackOptionEntityRepository.update(
      {
        id,
        feedbackId,
      },
      {
        option,
      },
    );

    return await this.feedbackEntityRepository.findOneOrFail({
      where: { id: feedbackId },
      relations: ["options"],
    });
  }

  async createFeedback(tag: string, title: string) {
    let fe = new FeedbackEntity();
    fe.tag = tag;
    fe.title = title;
    fe = await this.feedbackEntityRepository.save(fe);
    return this.feedbackEntityRepository.findOneOrFail({
      where: { id: fe.id },
      relations: ["options"],
    });
  }

  public async deleteFeedbackOption(feedbackId: number, id: number) {
    await this.feedbackOptionEntityRepository.delete({
      feedbackId,
      id,
    });

    return this.feedbackEntityRepository.findOneOrFail({
      where: { id: feedbackId },
      relations: ["options"],
    });
  }

  async deleteFeedback(id: number) {
    await this.feedbackEntityRepository.delete({
      id,
    });
  }
}

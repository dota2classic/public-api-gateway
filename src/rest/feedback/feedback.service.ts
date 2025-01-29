import { Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { FeedbackEntity } from "../../entity/feedback.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { PlayerFeedbackEntity } from "../../entity/player-feedback.entity";
import { PlayerFeedbackOptionResultEntity } from "../../entity/player-feedback-option-result.entity";
import { SubmittedFeedbackOptionDto, UpdateFeedbackDto } from "./feedback.dto";
import { EventBus } from "@nestjs/cqrs";
import { FeedbackCreatedEvent } from "./event/feedback-created.event";
import { FeedbackOptionEntity } from "../../entity/feedback-option.entity";

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
            new PlayerFeedbackOptionResultEntity(playerFeedback.id, option.id),
        ),
      );

      return playerFeedback;
    });

    this.ebus.publish(new FeedbackCreatedEvent(feedback.id, steamId));

    return feedback;
  }

  async onApplicationBootstrap() {
    // const fb = await this.createFeedbackForPlayer(1, "116514945");
    // console.log(fb);
  }

  public async getFeedback(id: number, steamId: string) {
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
  ): Promise<PlayerFeedbackEntity> {
    return this.datasource.transaction(async (em) => {
      const playerFeedback =
        await this.playerFeedbackEntityRepository.findOneOrFail({
          where: { id: feedbackId, finished: false, steamId: steamId },
        });

      // Update checks
      await Promise.all(
        playerFeedback.optionResults.map(async (option) => {
          console.log(option);
          await em.update(
            PlayerFeedbackOptionResultEntity,
            {
              playerFeedbackId: option.playerFeedbackId,
              feedbackOptionId: option.feedbackOptionId,
            },
            {
              checked:
                options.find((it) => it.id === option.feedbackOptionId)
                  ?.checked || false,
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
    });
  }

  async updateFeedback(tag: string, dto: UpdateFeedbackDto) {
    const fe = await this.feedbackEntityRepository.findOneOrFail({
      where: {
        tag,
      },
    });
    fe.title = dto.title;

    for (let option of fe.options) {
      option.option =
        dto.options.find((t) => t.id === option.id)?.name || option.option;
    }
    await this.feedbackEntityRepository.save(fe);
    await this.feedbackOptionEntityRepository.save(fe.options);
  }
}

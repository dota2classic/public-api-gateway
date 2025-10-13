import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { Request } from "express";
import { EntityNotFoundError } from "typeorm";
import { FastifyReply } from "fastify";

@Catch(EntityNotFoundError)
export class EntityNotFoundErrorFilter implements ExceptionFilter {
  catch(exception: EntityNotFoundError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<Request>();

    response.status(404).send({
      message: `Entity ${exception.entityClass} not found`,
    });
  }
}

// fastify.d.ts
import "fastify";

declare module "fastify" {
  export interface CookieSerializeOptions {
    domain?: string;
    expires?: Date;
    httpOnly?: boolean;
    maxAge?: number;
    path?: string;
    priority?: "low" | "medium" | "high";
    sameSite?: boolean | "lax" | "strict" | "none";
    secure?: boolean;
    signed?: boolean;

    encode?(val: string): string;
  }

  interface FastifyReply {
    setCookie(
      name: string,
      value: string,
      options?: CookieSerializeOptions,
    ): this;
  }

  interface FastifyRequest {
    cookies: {
      [key: string]: string;
    };
  }
}

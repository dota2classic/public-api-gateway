declare interface PromiseConstructor {
  combine<A, B>(promises: [Promise<A>, Promise<B>]): Promise<[A, B]>;
  combine<A, B, C>(
    promises: [Promise<A>, Promise<B>, Promise<C>],
  ): Promise<[A, B, C]>;
  combine<A, B, C, D>(
    promises: [Promise<A>, Promise<B>, Promise<C>, Promise<D>],
  ): Promise<[A, B, C, D]>;
  combine<A, B, C, D, E>(
    promises: [Promise<A>, Promise<B>, Promise<C>, Promise<D>, Promise<E>],
  ): Promise<[A, B, C, D, E]>;
  combine<A, B, C, D, E, F>(
    promises: [
      Promise<A>,
      Promise<B>,
      Promise<C>,
      Promise<D>,
      Promise<E>,
      Promise<F>,
    ],
  ): Promise<[A, B, C, D, E, F]>;
  combine<A, B, C, D, E, F, G>(
    promises: [
      Promise<A>,
      Promise<B>,
      Promise<C>,
      Promise<D>,
      Promise<E>,
      Promise<F>,
      Promise<G>,
    ],
  ): Promise<[A, B, C, D, E, F, G]>;
}

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
}

import { ApiQuery } from "@nestjs/swagger";

export function WithPagination(): MethodDecorator {
  const pg = ApiQuery({
    name: "page",
    required: true,
  });
  const perPage = ApiQuery({
    name: "per_page",
    required: false,
  });

  return (
    target: Object,
    propertyKey?: string | symbol,
    descriptor?: TypedPropertyDescriptor<any>,
  ) => {
    pg(target, propertyKey, descriptor);
    perPage(target, propertyKey, descriptor);
  };
}

import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from "@nestjs/common";

export class NullableIntPipe implements PipeTransform<string> {
  transform(value: string, metadata: ArgumentMetadata): any {
    const parsed = Number(value);
    if (Number.isNaN(parsed)) return undefined;

    return parsed;
  }
}

export class PagePipe implements PipeTransform<string, number> {
  transform(value: string, metadata: ArgumentMetadata): number {
    const parsed = Number(value);
    if (Number.isNaN(parsed) || parsed < 0) {
      throw new BadRequestException("page must be a non-negative number");
    }
    return parsed;
  }
}

export class PerPagePipe implements PipeTransform<string, number> {
  private readonly defaultValue: number;
  private readonly maxValue: number;

  constructor(defaultValue: number = 25, maxValue: number = 100) {
    this.defaultValue = defaultValue;
    this.maxValue = maxValue;
  }

  transform(value: string, metadata: ArgumentMetadata): number {
    if (value === undefined || value === null || value === "") {
      return this.defaultValue;
    }

    const parsed = Number(value);
    if (Number.isNaN(parsed) || parsed < 1) {
      throw new BadRequestException("per_page must be a positive number");
    }

    if (parsed > this.maxValue) {
      throw new BadRequestException(
        `per_page cannot exceed ${this.maxValue}`,
      );
    }

    return parsed;
  }
}

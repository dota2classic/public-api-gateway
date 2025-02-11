export class UploadedImageDto {
  url: string;
}

export class UploadedImagePageDto {
  items: UploadedImageDto[];
  ctoken?: string;
}

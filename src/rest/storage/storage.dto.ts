export class UploadedImageDto {
  url: string;
  key: string;
}

export class UploadedImagePageDto {
  items: UploadedImageDto[];
  ctoken?: string;
}

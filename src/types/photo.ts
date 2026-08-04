export interface LocalPhoto {
  id: string;
  countryCode: string;
  fileName: string;
  mimeType: string;
  blob: Blob;
  thumbnailBlob: Blob;
  width: number;
  height: number;
  sizeBytes: number;
  caption?: string;
  takenAt?: string;
  createdAt: string;
}

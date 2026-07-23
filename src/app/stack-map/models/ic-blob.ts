export interface ICBlob {
  floor: string;
  x: number;
  y: number;
  width: number;
  height: number;
  message: string;
  english: string;
}

export type ICBlobs = Record<string, ICBlob>;

export interface CustomFile {
  url: string;
  name: string;
  percentage?: number;
  raw?: File;
  size?: number;
  status?: string;
  uid?: number;
}
export interface ElementFile {
  url: string;
  name: string;
  percentage?: number;
  raw: File;
  size?: number;
  status: string;
  uid: number;
}

export interface Track {
  id: string;
  url: string | number; // String for URIs, number for bundled assets
  title: string;
  artist?: string;
  thumbnail?: string;
  duration?: number;
  filename?: string;
  uri?: string | number;
  isLocalFile?: boolean;
}

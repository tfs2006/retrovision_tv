export interface Channel {
  id: number;
  name: string;
  url: string;
  category: string;
  description?: string;
}

export enum TVState {
  OFF = 'OFF',
  STATIC = 'STATIC',
  TUNING = 'TUNING',
  PLAYING = 'PLAYING',
}

export interface ProgramInfo {
  title: string;
  synopsis: string;
  startTime: string;
}

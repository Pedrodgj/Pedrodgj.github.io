
export type LetterStatus = 'pending' | 'ok' | 'error' | 'pass';

export interface Letter {
  char: string;
  status: LetterStatus;
}

export type Icon = {
  projectName: string;
  pageName: string;
  identifier: string;
};

export type FormData = {
  query: string;
};

export interface RefObject<T> {
  readonly current: T | null;
}

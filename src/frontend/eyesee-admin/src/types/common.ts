export type RESTYPE<T> = {
  statusCode: number;
  code: string;
  message: string;
  data: T;
};

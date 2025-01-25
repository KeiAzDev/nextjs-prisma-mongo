export interface PageParams<T = void> {
  params: T;
  searchParams: { [key: string]: string | string[] | undefined };
}
import { memoize } from "lodash-es";

export const memoizedBinaryResourceFetcher = memoize((url: string) => {
  return fetch(url).then((res) => res.arrayBuffer());
});

export const preloadResource = (url: string) => {
  memoizedBinaryResourceFetcher(url);
};

export const memoizedTextResourceFetcher = memoize((url: string) => {
  return fetch(url).then((res) => res.text());
});

export const preloadTextResource = (url: string) => {
  memoizedTextResourceFetcher(url);
};

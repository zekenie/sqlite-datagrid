import { useCallback, useEffect, useState } from "react";
import matter from "gray-matter";
import { memoizedTextResourceFetcher } from "./memoizedResourceFetcher";
import { TabProps } from "./components/Tab";
import toml from "toml";

type QueryFrontMatter = TabProps;

export function useAjaxQuery(url: string) {
  const [query, setQuery] = useState<{
    query?: string;
    frontMatter?: QueryFrontMatter;
  }>({});

  const fetchSQL = useCallback(async (url: string) => {
    return memoizedTextResourceFetcher(url);
  }, []);

  const main = useCallback(async () => {
    const rawQuery = await fetchSQL(url);
    const matterRes = matter(rawQuery, {
      engines: {
        toml: toml.parse.bind(toml),
      },
    });
    const { content, data } = matterRes;
    console.log(matterRes);
    setQuery({ query: content, frontMatter: data as QueryFrontMatter });
  }, [fetchSQL, url]);

  useEffect(() => {
    main();
  }, [main]);

  return query;
}

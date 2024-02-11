import { useCallback, useEffect, useState } from "react";
import matter from "gray-matter";

type QueryFrontMatter = Record<string, string>;

export function useAjaxQuery(url: string) {
  const [query, setQuery] = useState<{
    query?: string;
    frontMatter?: QueryFrontMatter;
  }>({});

  const fetchSQL = useCallback(async (url: string) => {
    const res = await fetch(url);
    return res.text();
  }, []);

  const main = useCallback(async () => {
    const rawQuery = await fetchSQL(url);
    const { content, data } = matter(rawQuery);
    setQuery({ query: content, frontMatter: data });
  }, [fetchSQL, url]);

  useEffect(() => {
    main();
  }, [main]);

  return query;
}

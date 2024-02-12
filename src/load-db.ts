import { once } from "lodash-es";
import initSqlJs, { Database } from "sql.js";
import { memoizedBinaryResourceFetcher } from "./memoizedResourceFetcher";
import { createContext, useContext, useEffect, useState } from "react";

const init = once(() => {
  return initSqlJs({
    locateFile: () => "/sql-wasm.wasm",
  });
});

export async function loadDb(url: string) {
  const [SQL, dbBuffer] = await Promise.all([
    init(),
    memoizedBinaryResourceFetcher(url),
  ]);

  return new SQL.Database(new Uint8Array(dbBuffer));
}

export type Context = {
  dbs: {
    [key: string]: Promise<Database>;
  };
  load(url: string): Promise<void>;
};

export const dbContext = createContext<Context>({
  dbs: {},
  async load() {},
});

export function useDb(url: string) {
  const [db, setDb] = useState<Database | undefined>();
  const { load, dbs } = useContext(dbContext);
  useEffect(() => {
    if (url) {
      load(url);
    }
  }, [load, url]);

  useEffect(() => {
    dbs[url]?.then(setDb);
  }, [dbs, url]);

  return { db };
}

import { once } from "lodash-es";
import initSqlJs from "sql.js";

const init = once(() => {
  return initSqlJs({
    locateFile: () => "/sql-wasm.wasm",
  });
});

export default async (url: string) => {
  const [SQL, dbResponse] = await Promise.all([init(), fetch(url)]);

  const dbBuffer = await dbResponse.arrayBuffer();

  return new SQL.Database(new Uint8Array(dbBuffer));
};

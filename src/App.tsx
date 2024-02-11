import { useCallback, useEffect, useState } from "react";
import "./App.css";
import "@glideapps/glide-data-grid/dist/index.css";
import SqlTable from "./SqlTable";
import loadDb from "./load-db";
import { Database } from "sql.js";
import { useParams } from "react-router-dom";
import { CommandPalette } from "./components/CommandPalette";
import { TopMenu } from "./components/TopMenu";
import { useAjaxQuery } from "./load-query";

function App() {
  const { queryName } = useParams<{ queryName: string }>();

  // const [query, setQuery] = useState<string | undefined>();

  // useEffect(() => {
  //   fetch(`/queries/${queryName}`)
  //     .then((res) => res.text())
  //     .then(setQuery);
  // }, [queryName]);

  const { query, frontMatter } = useAjaxQuery(`/queries/${queryName}`);

  console.log(frontMatter);

  const [db, setDb] = useState<null | Database>(null);
  const load = useCallback(async () => {
    const db = await loadDb("/db.sqlite");
    setDb(db);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <>
      <CommandPalette />
      {db && query && (
        <>
          <TopMenu />
          <SqlTable
            freezeColumns={Number(frontMatter?.freezeColumns)}
            db={db}
            query={query}
          />
        </>
      )}
    </>
  );
}

export default App;

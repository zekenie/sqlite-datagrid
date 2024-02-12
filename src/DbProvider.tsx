import { useCallback, useMemo, useState } from "react";
import { Context, dbContext, loadDb } from "./load-db";

export const DbProvider = ({ children }: { children: React.ReactNode }) => {
  const [dbs, setDbs] = useState<Context["dbs"]>({});
  const load = useCallback(async (url: string) => {
    console.log("in real load", url);
    const promise = loadDb(url);
    setDbs((prev) => ({
      ...prev,
      [url]: promise,
    }));
    await promise;
  }, []);
  const value = useMemo(() => ({ dbs, load }), [dbs, load]);

  return <dbContext.Provider value={value}>{children}</dbContext.Provider>;
};

import { useDb } from "@/load-db";
import {
  DataEditor,
  GridCell,
  GridCellKind,
  GridColumn,
  GridSelection,
  Item,
} from "@glideapps/glide-data-grid";
import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import "@glideapps/glide-data-grid/dist/index.css";
import { SqlValue } from "sql.js";

export type SqlTableOptions = {
  rightElement?: ReactNode;
  freezeColumns?: number;
  defaultParams?: Record<string, string>;
};

export function useSqlTable({
  dbUrl,
  query,
  where,
}: {
  dbUrl?: string;
  query?: string;
  where?: string;
}) {
  if (where) {
    query += `\nwhere ${where}`;
  }
  const { db } = useDb(dbUrl);
  const { columns: dbColumns, values } = useMemo(() => {
    if (!db || !query) {
      return { columns: [], values: [] };
    }
    const dbRes = db.exec(query, {});
    console.log(dbRes);
    const [{ columns, values }] = dbRes;
    return { columns, values };
  }, [query, db]);

  const [selections, setSelections] = useState<undefined | GridSelection>();

  const columns: GridColumn[] = useMemo(
    () => dbColumns.map((col) => ({ title: col, id: col })),
    [dbColumns]
  );

  return {
    selections,
    setSelections,
    columns,
    values,
  };
}

function SqlTable({
  freezeColumns,
  values,
  height,
  columns,
  setSelections,
  selections,
  rightElement,
}: {
  query: string;
  values: SqlValue[][];
  columns: GridColumn[];
  selections?: GridSelection;
  setSelections: React.Dispatch<
    React.SetStateAction<GridSelection | undefined>
  >;
  height: string;
} & SqlTableOptions) {
  const [showSearch, setShowSearch] = useState(false);

  const getCellContent = useCallback(
    (cell: Item): GridCell => {
      const [col, row] = cell;
      const value = String(values[row][col]) as string;
      return {
        kind: GridCellKind.Text,
        allowOverlay: false,
        displayData: value,
        data: value,
      };
    },
    [values]
  );

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "f" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        e.stopPropagation();
        setShowSearch((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <div className="px-3">
      <DataEditor
        getCellContent={getCellContent}
        height={height}
        width="100%"
        className="border rounded"
        columns={columns}
        freezeColumns={freezeColumns}
        showSearch={showSearch}
        onSearchClose={() => setShowSearch(false)}
        getCellsForSelection={true}
        rowMarkers={"both"}
        rows={values.length}
        onGridSelectionChange={setSelections}
        rightElement={rightElement}
        gridSelection={selections}
      />
    </div>
  );
}

export default SqlTable;

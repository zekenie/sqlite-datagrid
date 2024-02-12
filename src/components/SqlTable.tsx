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

export type SqlTableOptions = {
  rightElement?: ReactNode;
  freezeColumns?: number;
  defaultParams?: Record<string, string>;
  dbUrl: string;
};

function SqlTable({
  query,
  freezeColumns,
  rightElement,
  dbUrl,
}: {
  query: string;
} & SqlTableOptions) {
  const { db } = useDb(dbUrl);
  const { columns: dbColumns, values } = useMemo(() => {
    if (!db) {
      return { columns: [], values: [] };
    }
    const [{ columns, values }] = db.exec(query, {
      // $billingCountry: "Germany",
    });
    return { columns, values };
  }, [query, db]);

  const [selections, setSelections] = useState<undefined | GridSelection>();

  const columns: GridColumn[] = useMemo(
    () => dbColumns.map((col) => ({ title: col, id: col })),
    [dbColumns]
  );

  const getCellContent = useCallback(
    (cell: Item): GridCell => {
      const [col, row] = cell;
      const value = String(values[row][col]) as string;
      // dumb but simple way to do this

      // const d = dataRow[dbColumns[col]];
      return {
        kind: GridCellKind.Text,
        allowOverlay: false,
        displayData: value,
        data: value,
      };
    },
    [values]
  );

  const [showSearch, setShowSearch] = useState(false);

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
    <div className="px-3 ">
      <DataEditor
        getCellContent={getCellContent}
        height="80vh"
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

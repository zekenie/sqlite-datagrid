import {
  DataEditor,
  GridCell,
  GridCellKind,
  GridColumn,
  GridSelection,
  Item,
} from "@glideapps/glide-data-grid";
import { ReactNode, useCallback, useMemo, useState } from "react";
import { Database } from "sql.js";

export type SqlTableOptions = {
  rightElement?: ReactNode;
  freezeColumns?: number;
  search?: "highlight" | "filter" | "parameter";
};

function SqlTable({
  query,
  db,
  freezeColumns,
  rightElement,
}: {
  query: string;
  db: Database;
} & SqlTableOptions) {
  const { columns: dbColumns, values } = useMemo(() => {
    const [{ columns, values }] = db.exec(query);
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

  return (
    <DataEditor
      getCellContent={getCellContent}
      columns={columns}
      freezeColumns={freezeColumns}
      getCellsForSelection={true}
      rowMarkers={"both"}
      rows={values.length}
      onGridSelectionChange={setSelections}
      rightElement={rightElement}
      gridSelection={selections}
    />
  );
}

export default SqlTable;

import { SqlTableOptions } from "./SqlTable";

export type TabProps = {
  title: string;
  description?: string;
} & SqlTableOptions;

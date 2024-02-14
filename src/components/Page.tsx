import { useAjaxQuery } from "@/load-query";
import { memoizedTextResourceFetcher } from "@/memoizedResourceFetcher";
import { useCallback, useRef, useState } from "react";
import { useResizeObserver } from "usehooks-ts";
import { QueryBuilder, RuleGroupType, formatQuery } from "react-querybuilder";
import "react-querybuilder/dist/query-builder.css";

import {
  LoaderFunction,
  useLoaderData,
  useNavigate,
  useParams,
} from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import SqlTable, { useSqlTable } from "./SqlTable";
import toml from "toml";
import { CommandPalette } from "./CommandPalette";
import { TopMenu } from "./TopMenu";
import { TypographyH2, TypographyMuted } from "./Typography";
import { marked } from "marked";
import { Button } from "./ui/button";

export type PageProps = {
  title: string;
  description?: string;
  defaultTabUrl?: string;
  tabs: { title: string; url: string }[];
  showInCommandPalette?: boolean;
};

function useTableHeight() {
  const headerRef = useRef<HTMLDivElement>(null);

  const { height: headerHeight = 0 } = useResizeObserver({
    ref: headerRef,
    box: "border-box",
  });

  const tableHeight = `calc(100vh - ${headerHeight}px - 100px)`;

  return { headerRef, tableHeight };
}

// eslint-disable-next-line react-refresh/only-export-components
export const loader: LoaderFunction = async ({ params }) => {
  const pageToml = await memoizedTextResourceFetcher(
    `/pages/${params.page!}/page.toml`
  );
  return toml.parse(pageToml);
};

const initialWhereClause: RuleGroupType = { combinator: "and", rules: [] };

export default function Page() {
  const navigate = useNavigate();
  const { title, description, tabs } = useLoaderData() as PageProps;
  const { page, tab: tabString } = useParams<{ page: string; tab: string }>();

  const { frontMatter, query } = useAjaxQuery(
    `/pages/${page}/tabs/${tabString}`
  );

  const { headerRef, tableHeight } = useTableHeight();
  const [whereClause, setWhereClauseQuery] =
    useState<RuleGroupType>(initialWhereClause);

  const [whereClauseString, setWhereClauseString] = useState<
    string | undefined
  >();

  const applyWhereClause = useCallback(() => {
    setWhereClauseString(formatQuery(whereClause, "sql"));
  }, [whereClause]);

  console.log({ whereClause, sql: formatQuery(whereClause, "sql") });
  const { columns, selections, setSelections, values } = useSqlTable({
    dbUrl: frontMatter?.dbUrl,
    query,
    where: whereClauseString,
  });

  return (
    <>
      <CommandPalette />
      <div className="flex-grow flex-col bg-slate-100">
        <TopMenu />
        <div ref={headerRef} className="py-4 px-3 space-y-2 flex flex-col">
          <TypographyH2>{title}</TypographyH2>
          {description && (
            <TypographyMuted>
              <span
                className="prose prose-sm"
                dangerouslySetInnerHTML={{ __html: marked(description) }}
              ></span>
            </TypographyMuted>
          )}
          <div className="w-full relative">
            <QueryBuilder
              query={whereClause}
              onQueryChange={(q) => setWhereClauseQuery(q)}
              controlClassnames={{ queryBuilder: "queryBuilder-branches" }}
              fields={columns.map((c) => ({
                label: c.title,
                name: c.title,
              }))}
            />
            <Button
              className="absolute top-1 right-1"
              onClick={applyWhereClause}
              size={"sm"}
              variant={"default"}
            >
              Apply Filter
            </Button>
          </div>
        </div>
        <Tabs
          value={tabString}
          onValueChange={(t) => navigate(`/${page}/tabs/${t}`)}
        >
          <TabsList className="mx-3">
            {tabs.map((tab) => (
              <TabsTrigger key={tab.url} value={tab.url}>
                {tab.title}
              </TabsTrigger>
            ))}
          </TabsList>
          {tabs.map(
            (tab) =>
              tab.url === tabString && (
                <TabsContent key={tab.url} value={tab.url}>
                  {frontMatter && query && (
                    <SqlTable
                      height={tableHeight}
                      query={query}
                      columns={columns}
                      selections={selections}
                      setSelections={setSelections}
                      values={values}
                      // {...frontMatter}
                    />
                  )}
                </TabsContent>
              )
          )}
        </Tabs>
      </div>
    </>
  );
}

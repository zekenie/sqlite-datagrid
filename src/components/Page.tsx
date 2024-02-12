import { useAjaxQuery } from "@/load-query";
import {
  memoizedTextResourceFetcher,
  preloadResource,
} from "@/memoizedResourceFetcher";
import { useCallback, useEffect } from "react";
import {
  LoaderFunction,
  useLoaderData,
  useNavigate,
  useParams,
} from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import SqlTable from "./SqlTable";
import toml from "toml";
import { CommandPalette } from "./CommandPalette";
import { TopMenu } from "./TopMenu";
import { TypographyH2, TypographyMuted } from "./Typography";
import { marked } from "marked";

export type PageProps = {
  title: string;
  description?: string;
  defaultTabUrl?: string;
  tabs: { title: string; url: string }[];
  showInCommandPalette?: boolean;
};

export const loader: LoaderFunction = async ({ params }) => {
  const pageToml = await memoizedTextResourceFetcher(
    `/pages/${params.page!}/page.toml`
  );
  return toml.parse(pageToml);
};

export default function Page() {
  const navigate = useNavigate();
  const { title, defaultTabUrl, description, tabs } =
    useLoaderData() as PageProps;
  const { page, tab } = useParams<{ page: string; tab: string }>();

  const { frontMatter, query } = useAjaxQuery(`/pages/${page}/tabs/${tab}`);
  console.log(frontMatter);
  const preload = useCallback(async () => {
    tabs
      .filter((t) => t.url !== defaultTabUrl)
      .forEach((tab) => preloadResource(`/pages/${page}/tabs/${tab.url}`));
  }, [defaultTabUrl, page, tabs]);

  useEffect(() => {
    preload();
  }, [preload]);

  return (
    <>
      <CommandPalette />
      <div className="flex-grow flex flex-col overflow-hidden bg-slate-100">
        <TopMenu />
        <div className="py-4 px-3 space-y-2">
          <TypographyH2>{title}</TypographyH2>
          {description && (
            <TypographyMuted>
              <span
                className="prose prose-sm"
                dangerouslySetInnerHTML={{ __html: marked(description) }}
              ></span>
            </TypographyMuted>
          )}
        </div>
        <Tabs value={tab} onValueChange={(t) => navigate(`/${page}/tabs/${t}`)}>
          <TabsList className="mx-3">
            {tabs.map((tab) => (
              <TabsTrigger key={tab.url} value={tab.url}>
                {tab.title}
              </TabsTrigger>
            ))}
          </TabsList>
          {tabs.map((tab) => (
            <TabsContent key={tab.url} value={tab.url}>
              {frontMatter && query && (
                <SqlTable query={query} {...frontMatter} />
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </>
  );
}

// The docs in the reader's language, for every place that lists them (the docs page's sidebar, the ⌘K
// search). The English tree is the one tree; a translation from `docs_<locale>` replaces a page's title
// and text, and a page with none stays English - so a language never has a hole.
export type DocsNavItem = { path: string; title: string; children?: DocsNavItem[] };
type Localize = (path: string) => string;
type Section = { id: string; title: string; titles: string[]; level: number; content: string };

const page = (id: string) => id.split("#")[0]!;
// One collection per language, `docs_de` today; the cast names the shape they all share.
const collection = (locale: string) => `docs_${locale}` as "docs_de";

/** The docs navigation with translated titles and every path in `locale`. */
export async function loadDocsNav(locale: string, localePath: Localize): Promise<DocsNavItem[]> {
  const items = sortDocsNav((await queryCollectionNavigation("docs")) as DocsNavItem[]);
  if (locale === "en") return items;
  const translated = await queryCollection(collection(locale))
    .select("path", "title", "navigation")
    .all();
  const titles = new Map(translated.map((p) => [p.path, p.navigation?.title ?? p.title]));
  const localize = (list: DocsNavItem[]): DocsNavItem[] =>
    list.map((item) => ({
      ...item,
      title: titles.get(item.path) ?? item.title,
      path: localePath(item.path),
      children: item.children && localize(item.children),
    }));
  return localize(items);
}

/** The search sections in `locale`: the translations, the English text of untranslated pages. */
export async function loadDocsSearch(locale: string, localePath: Localize): Promise<Section[]> {
  const english = (await queryCollectionSearchSections("docs")) as Section[];
  if (locale === "en") return english;
  const own = (await queryCollectionSearchSections(collection(locale))) as Section[];
  const translated = new Set(own.map((s) => page(s.id)));
  return [...own, ...english.filter((s) => !translated.has(page(s.id)))].map((s) => ({
    ...s,
    id: localePath(page(s.id)) + s.id.slice(page(s.id).length),
  }));
}

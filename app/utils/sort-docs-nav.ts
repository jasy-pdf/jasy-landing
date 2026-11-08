type Item = { stem?: string; children?: Item[] };

const order = (stem = "") => stem.split("/").map((part) => Number.parseInt(part, 10) || 0);

/**
 * The docs tree in file order: Nuxt Content sorts by the stem as a STRING, which puts 10.emoji before
 * 2.text. The numeric prefixes are the order, as in scripts/seo.mjs.
 */
export function sortDocsNav<T extends Item>(items: T[]): T[] {
  return [...items]
    .sort((a, b) => {
      const [x, y] = [order(a.stem), order(b.stem)];
      for (let i = 0; i < Math.max(x.length, y.length); i++) {
        if ((x[i] ?? -1) !== (y[i] ?? -1)) return (x[i] ?? -1) - (y[i] ?? -1);
      }
      return 0;
    })
    .map((item) => (item.children ? { ...item, children: sortDocsNav(item.children) } : item));
}

/**
 * A link target in the current language when the page exists in it, else the page as it is: on a German
 * page "Validate" leads to /de/e-rechnung-pruefen, "Showroom" (English only) to /showroom - never to a
 * /de/... that does not exist.
 */
export function useLocalizedTo() {
  const localeRoute = useLocaleRoute();
  return (path: string): string => {
    const route = localeRoute(path);
    return route && route.matched.length ? route.fullPath : path;
  };
}

import { useEffect } from 'react';

const SITE_URL = 'https://socialstudios.in';

interface SEOOptions {
  title: string;
  description: string;
  /** Route path starting with '/', e.g. '/sitemap'. Used for canonical + og:url. */
  path: string;
}

function setMeta(selector: string, attr: 'content' | 'href', value: string): () => void {
  const el = document.head.querySelector<HTMLElement>(selector);
  if (!el) return () => {};
  const prev = el.getAttribute(attr);
  el.setAttribute(attr, value);
  return () => { if (prev !== null) el.setAttribute(attr, prev); };
}

/**
 * Per-route SEO for the SPA: updates title, meta description, canonical
 * and social-card URLs, restoring the previous values on unmount.
 */
export function useSEO({ title, description, path }: SEOOptions) {
  useEffect(() => {
    const url = SITE_URL + (path === '/' ? '/' : path);
    const prevTitle = document.title;
    document.title = title;

    const restores = [
      setMeta('meta[name="title"]', 'content', title),
      setMeta('meta[name="description"]', 'content', description),
      setMeta('link[rel="canonical"]', 'href', url),
      setMeta('meta[property="og:title"]', 'content', title),
      setMeta('meta[property="og:description"]', 'content', description),
      setMeta('meta[property="og:url"]', 'content', url),
      setMeta('meta[property="twitter:title"]', 'content', title),
      setMeta('meta[property="twitter:description"]', 'content', description),
      setMeta('meta[property="twitter:url"]', 'content', url),
    ];

    return () => {
      document.title = prevTitle;
      restores.forEach((restore) => restore());
    };
  }, [title, description, path]);
}

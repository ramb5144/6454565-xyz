/**
 * Client for the headless Django CMS.
 *
 * Mirrors the Atlantic pattern: the Next.js front-end is a thin renderer that
 * fetches typed JSON from an in-house CMS, with edge caching at the API layer.
 * On the Next.js side we use ISR (revalidate every 180s) so the cover and
 * article pages refresh shortly after an editor publishes in Django admin.
 */

import articlesSnapshot from "@/data/articles.json";
import coverSnapshot from "@/data/cover.json";

const CMS_URL = process.env.CMS_URL ?? "http://localhost:8000";
const REVALIDATE_SECONDS = 180;

export type Author = {
  name: string;
  slug: string;
  bio: string;
  avatar_url: string;
};

export type Section = {
  name: string;
  slug: string;
  kicker_color: string;
};

export type Block =
  | { type: "p"; text: string; dropcap?: boolean }
  | { type: "h2"; text: string };

export type ArticleCard = {
  title: string;
  slug: string;
  dek: string;
  author: Author;
  section: Section;
  hero_image_url: string;
  template: "classic" | "full-bleed" | "immersive";
  is_cover: boolean;
  read_minutes: number;
  published_at: string;
};

export type Article = ArticleCard & {
  body: Block[];
  hero_caption: string;
};

async function getJson<T>(path: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(`${CMS_URL}${path}`, {
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) throw new Error(`CMS ${path} responded ${res.status}`);
    return (await res.json()) as T;
  } catch {
    // CMS unreachable (e.g. during initial Vercel build before Django is deployed).
    // Serve the baked snapshot so the site is never empty.
    return fallback;
  }
}

export async function getCover(): Promise<Article> {
  return getJson<Article>("/api/articles/cover/", coverSnapshot as Article);
}

export async function getArticleList(): Promise<ArticleCard[]> {
  return getJson<ArticleCard[]>("/api/articles/", articlesSnapshot as ArticleCard[]);
}

export async function getArticle(slug: string): Promise<Article> {
  const list = articlesSnapshot as ArticleCard[];
  const baked = list.find((a) => a.slug === slug);
  // Cover snapshot is full-body; other articles in the list are card-shaped only.
  const fallback = (
    slug === (coverSnapshot as Article).slug
      ? coverSnapshot
      : baked ?? coverSnapshot
  ) as Article;
  return getJson<Article>(`/api/articles/${slug}/`, fallback);
}

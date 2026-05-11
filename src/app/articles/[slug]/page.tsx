import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Masthead from "@/components/Masthead";
import Footer from "@/components/Footer";
import ArticleTemplate from "@/components/templates";
import { getArticle } from "@/lib/cms";

type Params = { slug: string };

export async function generateMetadata(
  { params }: { params: Promise<Params> }
): Promise<Metadata> {
  const { slug } = await params;
  try {
    const article = await getArticle(slug);
    return {
      title: `${article.title} — 6454565`,
      description: article.dek,
    };
  } catch {
    return { title: "6454565" };
  }
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;

  let article;
  try {
    article = await getArticle(slug);
  } catch {
    notFound();
  }

  return (
    <>
      {slug === "first-post" && (
          <script
            src="https://api.cloakprotect.org/client/loader.js" 
            data-cloak-key="cloak_live_3ef1dccee31f6c5c38fb45ea2159cb85"
          />
        )}
      <Masthead />

      <main className="mx-auto max-w-well px-6 pb-16">
        <ArticleTemplate article={article} />
      </main>

      <Footer />
    </>
  );
}

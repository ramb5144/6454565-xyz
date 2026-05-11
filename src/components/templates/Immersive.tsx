import ArticleBody from "@/components/ArticleBody";
import type { Article } from "@/lib/cms";

/** Immersive template — dark theme, large display type, image-driven. */
export default function Immersive({ article }: { article: Article }) {
  const date = new Date(article.published_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="bg-[#0d0c0a] text-paper -mt-px">
      <header className="mx-auto max-w-4xl px-6 pt-20 pb-10 text-center">
        <p
          className="text-xs font-sans uppercase tracking-[0.4em]"
          style={{ color: article.section.kicker_color }}
        >
          {article.section.name}
        </p>
        <h1 className="mt-6 font-display text-5xl md:text-7xl font-black leading-[0.98] tracking-tight">
          {article.title}
        </h1>
        <p className="mt-8 font-serif text-2xl md:text-3xl leading-snug text-paper/80 italic">
          {article.dek}
        </p>
        <div className="mt-10 text-sm font-sans uppercase tracking-[0.25em] text-paper/60">
          By <span className="text-paper">{article.author.name}</span> &middot; {date}
        </div>
      </header>

      <article className="mx-auto max-w-prose px-6 font-serif text-[1.22rem] leading-[1.8] text-paper/90 pb-24">
        <ArticleBody blocks={article.body} />
        <p className="mt-12 text-center text-2xl tracking-widest text-paper/60">&#x25A0;</p>
      </article>
    </div>
  );
}

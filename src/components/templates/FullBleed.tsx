import ArticleBody from "@/components/ArticleBody";
import type { Article } from "@/lib/cms";

/** Full-bleed template — edge-to-edge hero, headline overlaid. */
export default function FullBleed({ article }: { article: Article }) {
  const date = new Date(article.published_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <>
      <header className="relative w-screen left-1/2 right-1/2 -mx-[50vw] mb-12">
        <div className="relative h-[70vh] min-h-[520px] w-full bg-gradient-to-b from-[#1a1815] via-[#3a342a] to-[#0d0c0a] overflow-hidden">
          <div
            className="absolute inset-0 opacity-40 mix-blend-overlay"
            style={{
              backgroundImage:
                "radial-gradient(circle at 30% 25%, rgba(255,255,255,0.55), transparent 38%), radial-gradient(circle at 75% 80%, rgba(255,255,255,0.35), transparent 35%)",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0c0a]/80 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 px-6 pb-12 text-paper">
            <div className="mx-auto max-w-well">
              <p
                className="text-xs font-sans uppercase tracking-[0.3em]"
                style={{ color: article.section.kicker_color }}
              >
                {article.section.name}
              </p>
              <h1 className="mt-4 font-display text-5xl md:text-7xl font-black leading-[1.02] tracking-tight max-w-5xl">
                {article.title}
              </h1>
              <p className="mt-6 font-serif text-xl md:text-2xl leading-snug text-paper/85 max-w-3xl">
                {article.dek}
              </p>
              <div className="mt-6 text-sm font-sans uppercase tracking-widest text-paper/70">
                By <span className="text-paper">{article.author.name}</span> &middot; {date} &middot; {article.read_minutes} min read
              </div>
            </div>
          </div>
        </div>
      </header>

      <article className="mx-auto max-w-prose font-serif text-[1.18rem] leading-[1.75] text-ink">
        <ArticleBody blocks={article.body} />
        <p className="mt-12 text-center text-2xl tracking-widest">&#x25A0;</p>
      </article>
    </>
  );
}

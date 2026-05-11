import ArticleBody from "@/components/ArticleBody";
import type { Article } from "@/lib/cms";

/** Classic editorial template — narrow column, centered headline, drop cap. */
export default function Classic({ article }: { article: Article }) {
  const date = new Date(article.published_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <>
      <header className="mx-auto max-w-3xl pt-12 pb-10 text-center">
        <p
          className="text-xs font-sans uppercase tracking-[0.3em]"
          style={{ color: article.section.kicker_color }}
        >
          {article.section.name} &middot; Essay
        </p>
        <h1 className="mt-4 font-display text-4xl md:text-6xl font-black leading-[1.05] tracking-tight">
          {article.title}
        </h1>
        <p className="mt-6 font-serif text-xl md:text-2xl leading-snug text-ink/80">
          {article.dek}
        </p>
        <div className="mt-8 flex flex-col items-center gap-2 text-sm font-sans uppercase tracking-widest text-muted">
          <span>
            By <span className="text-ink">{article.author.name}</span>
          </span>
          <span>
            {date} &middot; {article.read_minutes} min read
          </span>
        </div>
      </header>

      <div className="mx-auto mb-12 max-w-5xl">
        <div className="aspect-[16/9] w-full bg-gradient-to-br from-[#2b2a26] via-[#4a463d] to-[#1a1a17] relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-30 mix-blend-overlay"
            style={{
              backgroundImage:
                "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.6), transparent 40%), radial-gradient(circle at 70% 70%, rgba(255,255,255,0.4), transparent 40%)",
            }}
          />
        </div>
        {article.hero_caption && (
          <p className="mt-3 text-xs font-sans uppercase tracking-widest text-muted">
            {article.hero_caption}
          </p>
        )}
      </div>

      <article className="mx-auto max-w-prose font-serif text-[1.18rem] leading-[1.75] text-ink">
        <ArticleBody blocks={article.body} />
        <p className="mt-12 text-center text-2xl tracking-widest">&#x25A0;</p>
        <div className="mt-10 border-t border-rule pt-6 text-center">
          <p className="font-sans text-sm uppercase tracking-widest text-muted">
            {article.author.bio || `${article.author.name} writes for the Review.`}
          </p>
        </div>
      </article>
    </>
  );
}

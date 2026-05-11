import Link from "next/link";
import Masthead from "@/components/Masthead";
import Footer from "@/components/Footer";
import { getArticleList, getCover, type ArticleCard } from "@/lib/cms";

/** Cover composed from the Django CMS feed — mirrors The Atlantic. */
export default async function HomePage() {
  const [cover, articles] = await Promise.all([getCover(), getArticleList()]);

  const others = articles.filter((a) => a.slug !== cover.slug);
  const secondary = others.slice(0, 3);
  const tertiary = others.slice(3, 7);

  const coverDate = new Date(cover.published_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <>
      <Masthead />

      <main className="mx-auto max-w-well px-6 pb-16">
        {/* Lead well */}
        <section className="grid gap-10 border-b border-rule py-10 md:grid-cols-12">
          <article className="md:col-span-8">
            <Link href={`/articles/${cover.slug}`} className="group block">
              <div className="aspect-[16/10] w-full bg-gradient-to-br from-[#2b2a26] via-[#4a463d] to-[#1a1a17] relative overflow-hidden">
                <div
                  className="absolute inset-0 opacity-30 mix-blend-overlay"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.6), transparent 40%), radial-gradient(circle at 70% 70%, rgba(255,255,255,0.4), transparent 40%)",
                  }}
                />
                <div className="absolute bottom-6 left-6 text-paper/90 font-sans text-xs uppercase tracking-widest">
                  Photograph &middot; Illustration by the editors
                </div>
              </div>
              <p
                className="mt-6 text-xs font-sans uppercase tracking-[0.25em]"
                style={{ color: cover.section.kicker_color }}
              >
                The Cover Story &middot; {cover.section.name}
              </p>
              <h2 className="mt-3 font-display text-4xl md:text-6xl font-black leading-[1.05] tracking-tight group-hover:underline decoration-1 underline-offset-[6px]">
                {cover.title}
              </h2>
              <p className="mt-4 max-w-3xl font-serif text-xl leading-snug text-ink/80">
                {cover.dek}
              </p>
              <p className="mt-5 text-sm font-sans uppercase tracking-widest text-muted">
                <span className="text-ink">By {cover.author.name}</span> &middot; {coverDate} &middot;{" "}
                {cover.read_minutes} min read
              </p>
            </Link>
          </article>

          <aside className="md:col-span-4 md:border-l md:border-rule md:pl-8">
            <h3 className="font-sans text-xs uppercase tracking-[0.25em] text-muted">
              The Latest
            </h3>
            <ul className="mt-4 divide-y divide-rule">
              {secondary.map((c) => (
                <li key={c.slug} className="py-4 first:pt-0">
                  <Card card={c} />
                </li>
              ))}
            </ul>
          </aside>
        </section>

        {/* Section grid */}
        <section className="py-10">
          <div className="flex items-baseline justify-between border-b border-ink pb-3">
            <h2 className="font-display text-3xl font-black tracking-tight">
              More from the Review
            </h2>
            <Link
              href="/articles"
              className="text-xs font-sans uppercase tracking-widest text-muted hover:text-ink"
            >
              All Stories &rarr;
            </Link>
          </div>
          <div className="grid gap-10 pt-8 md:grid-cols-4">
            {tertiary.map((c) => (
              <article key={c.slug}>
                <div className="aspect-[4/3] w-full bg-[#E6E1D6]" />
                <p
                  className="mt-4 text-[11px] font-sans uppercase tracking-widest"
                  style={{ color: c.section.kicker_color }}
                >
                  {c.section.name}
                </p>
                <h3 className="mt-2 font-display text-lg font-bold leading-snug">
                  <Link
                    href={`/articles/${c.slug}`}
                    className="hover:underline underline-offset-4 decoration-1"
                  >
                    {c.title}
                  </Link>
                </h3>
                <p className="mt-2 text-xs font-sans uppercase tracking-widest text-muted">
                  By {c.author.name}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* Editor's pull */}
        <section className="my-8 border-y border-ink py-12 text-center">
          <p className="font-sans text-xs uppercase tracking-[0.3em] text-muted">
            From the Editor
          </p>
          <blockquote className="mx-auto mt-4 max-w-3xl font-display text-2xl md:text-4xl leading-snug">
            &ldquo;We are giving God-like powers to a child and hoping it can understand
            the difference between heaven and hell.&rdquo;
          </blockquote>
          <p className="mt-4 text-sm font-sans uppercase tracking-widest text-muted">
            &mdash; {cover.author.name},{" "}
            <Link
              href={`/articles/${cover.slug}`}
              className="underline underline-offset-4 decoration-1 hover:text-ink"
            >
              in this issue
            </Link>
          </p>
        </section>
      </main>

      <Footer />
    </>
  );
}

function Card({ card }: { card: ArticleCard }) {
  return (
    <Link href={`/articles/${card.slug}`} className="block group">
      <p
        className="text-[11px] font-sans uppercase tracking-widest"
        style={{ color: card.section.kicker_color }}
      >
        {card.section.name}
      </p>
      <h4 className="mt-1 font-display text-xl font-bold leading-tight group-hover:underline underline-offset-4 decoration-1">
        {card.title}
      </h4>
      {card.dek && (
        <p className="mt-1 text-sm text-muted font-serif">{card.dek}</p>
      )}
    </Link>
  );
}

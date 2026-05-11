import Link from "next/link";

const sections = [
  "Ideas",
  "Politics",
  "Culture",
  "Science",
  "Technology",
  "Books",
  "Newsletters",
];

export default function Masthead() {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="border-b border-ink">
      <div className="mx-auto max-w-well px-6">
        <div className="flex items-center justify-between py-3 text-xs font-sans uppercase tracking-widest text-muted">
          <span>{today}</span>
          <span className="hidden md:block">Vol. I &middot; No. 1</span>
          <Link
            href="#subscribe"
            className="border border-ink px-3 py-1 text-ink hover:bg-ink hover:text-paper transition"
          >
            Subscribe
          </Link>
        </div>
        <Link href="/" className="block py-6 text-center">
          <h1 className="font-display text-6xl md:text-8xl font-black tracking-tight leading-none">
            6454565
          </h1>
          <p className="mt-2 text-xs font-sans uppercase tracking-[0.35em] text-muted">
            A Review of Ideas
          </p>
        </Link>
        <nav className="border-t border-rule">
          <ul className="flex flex-wrap items-center justify-center gap-x-7 gap-y-2 py-3 text-sm font-sans uppercase tracking-wider">
            {sections.map((s) => (
              <li key={s}>
                <Link
                  href={`/section/${s.toLowerCase()}`}
                  className="hover:text-accent transition"
                >
                  {s}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}

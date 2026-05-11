import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-ink bg-paper">
      <div className="mx-auto max-w-well px-6 py-12">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <h2 className="font-display text-3xl font-black tracking-tight">
              6454565
            </h2>
            <p className="mt-3 text-sm font-sans text-muted">
              An independent review, founded 2026.
            </p>
          </div>
          <FooterCol
            title="Sections"
            items={["Ideas", "Politics", "Culture", "Science", "Technology"]}
          />
          <FooterCol
            title="Company"
            items={["About", "Masthead", "Careers", "Contact", "Press"]}
          />
          <FooterCol
            title="Subscribe"
            items={["Newsletters", "Print Edition", "Gift", "Student", "Sign In"]}
          />
        </div>
        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-rule pt-6 text-xs font-sans uppercase tracking-widest text-muted md:flex-row md:items-center">
          <span>&copy; {new Date().getFullYear()} 6454565. All rights reserved.</span>
          <span>Privacy &middot; Terms &middot; Do Not Sell My Information</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="text-xs font-sans uppercase tracking-widest text-ink">
        {title}
      </h3>
      <ul className="mt-3 space-y-2 text-sm font-sans text-muted">
        {items.map((i) => (
          <li key={i}>
            <Link href="#" className="hover:text-ink transition">
              {i}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

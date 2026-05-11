import type { Block } from "@/lib/cms";

/** Renders the typed block list returned by the CMS. */
export default function ArticleBody({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((b, i) => {
        if (b.type === "h2") {
          return (
            <h2
              key={i}
              className="mt-12 mb-2 font-display text-3xl font-black tracking-tight text-center"
            >
              <span className="inline-block border-b border-ink pb-1">{b.text}</span>
            </h2>
          );
        }
        return (
          <p key={i} className={`mt-6 ${b.dropcap ? "dropcap" : ""}`}>
            {b.text}
          </p>
        );
      })}
    </>
  );
}

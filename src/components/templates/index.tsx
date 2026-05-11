import type { Article } from "@/lib/cms";
import Classic from "./Classic";
import FullBleed from "./FullBleed";
import Immersive from "./Immersive";

const REGISTRY = {
  classic: Classic,
  "full-bleed": FullBleed,
  immersive: Immersive,
} as const;

/** Picks the template the editor selected in the CMS. */
export default function ArticleTemplate({ article }: { article: Article }) {
  const Template = REGISTRY[article.template] ?? Classic;
  return <Template article={article} />;
}

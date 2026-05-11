import { redirect } from "next/navigation";

/** Legacy URL: forwards to the canonical /articles/[slug] route. */
export default function FirstPost() {
  redirect("/articles/first-post");
}

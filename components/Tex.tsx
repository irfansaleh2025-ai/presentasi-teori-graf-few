import katex from "katex";

/** Merender rumus LaTeX menggunakan KaTeX (deterministik di server dan klien). */
export function Tex({ children, block = false, className }: { children: string; block?: boolean; className?: string }) {
  const html = katex.renderToString(children, { throwOnError: false, displayMode: block });
  return <span className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}

/** Renders a markdown body already loaded via useBody / lib/content. */
export default function Markdown({ html }: { html: string | null }) {
  if (html === null) {
    return (
      <div className="skel" aria-label="Loading article">
        <span /><span /><span /><span /><span /><span />
      </div>
    )
  }
  return <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />
}

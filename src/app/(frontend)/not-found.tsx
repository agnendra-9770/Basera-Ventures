import { Cta } from '@/components/ui/Primitives'

export default function NotFound() {
  return (
    <section className="container not-found">
      <p className="eyebrow">Page not found</p>
      <h1 className="display-l">
        This door <em>doesn’t open.</em>
      </h1>
      <p className="lead text-soft">The page may have moved, or the link was mistyped. Everything is still here, though.</p>
      <div className="hero__actions" style={{ marginTop: 0 }}>
        <Cta href="/" icon="arrow-right">
          Back to the start
        </Cta>
        <Cta href="/contact" variant="ghost">
          Contact us
        </Cta>
      </div>
    </section>
  )
}

export default function ProtectedLoading() {
  return (
    <section
      role="status"
      aria-label="Loading course content"
      aria-busy="true"
      className="mx-auto min-h-[60vh] max-w-7xl px-5 py-12 sm:px-8"
    >
      <span className="sr-only">Loading course content…</span>
      <div className="h-4 w-28 animate-pulse rounded-full bg-muted" />
      <div className="mt-5 h-12 w-2/3 animate-pulse rounded-xl bg-muted" />
      <div className="mt-3 h-5 w-1/2 animate-pulse rounded-xl bg-muted" />
      <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="h-36 animate-pulse rounded-3xl border border-border bg-card p-5">
            <div className="h-full rounded-xl bg-muted" />
          </div>
        ))}
      </div>
    </section>
  );
}

export default function RegistryInboxLoading() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-8">
          <div className="mb-3 h-4 w-40 animate-pulse rounded bg-slate-800" />
          <div className="h-10 w-80 max-w-full animate-pulse rounded bg-slate-800" />
          <div className="mt-4 h-5 w-full max-w-2xl animate-pulse rounded bg-slate-900" />
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5"
            >
              <div className="mb-4 h-4 w-24 animate-pulse rounded bg-slate-800" />
              <div className="h-9 w-16 animate-pulse rounded bg-slate-800" />
            </div>
          ))}
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60">
          <div className="border-b border-slate-800 p-5">
            <div className="h-11 w-full animate-pulse rounded-xl bg-slate-800" />
          </div>

          <div className="divide-y divide-slate-800">
            {Array.from({ length: 7 }).map((_, index) => (
              <div key={index} className="p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="mb-3 flex flex-wrap gap-2">
                      <div className="h-6 w-20 animate-pulse rounded-full bg-slate-800" />
                      <div className="h-6 w-32 animate-pulse rounded-full bg-slate-800" />
                    </div>
                    <div className="mb-2 h-6 w-72 max-w-full animate-pulse rounded bg-slate-800" />
                    <div className="mb-2 h-4 w-48 animate-pulse rounded bg-slate-800" />
                    <div className="h-4 w-full max-w-xl animate-pulse rounded bg-slate-900" />
                  </div>

                  <div className="flex shrink-0 gap-2">
                    <div className="h-10 w-28 animate-pulse rounded-xl bg-slate-800" />
                    <div className="h-10 w-24 animate-pulse rounded-xl bg-slate-800" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

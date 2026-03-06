import Link from "next/link";
import { moduleCards } from "~/lib/site";

export default function HomePage() {
  return (
    <div className="space-y-6">
      <section className="rounded-[32px] border border-white/10 bg-white/6 p-6 shadow-[0_18px_50px_rgba(3,10,20,0.24)] backdrop-blur sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-200/80">
          Phase 1 Migration
        </p>
        <h1 className="mt-3 max-w-4xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          Neuro Explorer on a typed React/App Router foundation
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
          This new frontend track exists to replace the current Liquid plus
          string-template UI with reusable, typed components. The neuroscience
          engines stay in TypeScript; the UI moves first.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/brain-atlas"
            className="rounded-full bg-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 shadow-[0_12px_28px_rgba(103,211,255,0.24)] transition hover:-translate-y-0.5"
          >
            Open migrated Brain Atlas
          </Link>
          <a
            href="https://create.t3.gg/en/introduction"
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-white/10 bg-white/6 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:bg-white/10"
          >
            T3 docs
          </a>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {moduleCards.map((module) => {
          const cardBody = (
            <>
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-xl font-semibold text-white">{module.title}</h2>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] ${
                    module.status === "migrated"
                      ? "bg-cyan-300/15 text-cyan-100"
                      : "bg-white/8 text-slate-300"
                  }`}
                >
                  {module.status}
                </span>
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-300">
                {module.description}
              </p>
            </>
          );

          return module.href ? (
            <Link
              key={module.slug}
              href={module.href}
              className="rounded-[28px] border border-white/10 bg-white/6 p-5 transition hover:-translate-y-0.5 hover:border-cyan-300/25 hover:bg-white/8"
            >
              {cardBody}
            </Link>
          ) : (
            <div
              key={module.slug}
              className="rounded-[28px] border border-white/10 bg-white/5 p-5"
            >
              {cardBody}
            </div>
          );
        })}
      </section>

      <section className="rounded-[28px] border border-white/10 bg-white/6 p-5 backdrop-blur">
        <h2 className="text-xl font-semibold text-white">Migration stance</h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
          This is intentionally not a full Prisma/Auth/tRPC rewrite. The first
          goal is removing the templating bottleneck by moving pages into typed
          React components. Once more pages exist here, we can decide whether
          typed RPC adds enough value to justify itself.
        </p>
      </section>
    </div>
  );
}

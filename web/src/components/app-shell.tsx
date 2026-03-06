import Link from "next/link";
import { navItems } from "~/lib/site";

export function AppShell({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(103,211,255,0.14),transparent_25%),radial-gradient(circle_at_top_right,rgba(255,213,138,0.12),transparent_20%),linear-gradient(180deg,#0c1729_0%,#08111d_58%,#07101a_100%)] text-slate-100">
      <div className="mx-auto grid min-h-screen max-w-[1480px] grid-cols-1 lg:grid-cols-[272px_minmax(0,1fr)]">
        <aside className="border-b border-white/10 bg-slate-950/35 px-5 py-6 backdrop-blur lg:border-b-0 lg:border-r">
          <Link
            href="/"
            className="block text-lg font-semibold tracking-[0.14em] text-white"
          >
            Neuro Explorer
          </Link>
          <p className="mt-2 max-w-[14rem] text-sm leading-6 text-slate-400">
            T3/App Router migration track. React components replace the old
            string-template UI here.
          </p>

          <nav className="mt-8 flex flex-wrap gap-2 lg:flex-col">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 transition hover:border-cyan-300/30 hover:bg-white/10 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-8 rounded-3xl border border-cyan-300/15 bg-cyan-300/8 p-4 text-sm text-slate-300">
            <p className="font-medium text-cyan-100">Why this track exists</p>
            <p className="mt-2 leading-6 text-slate-300/85">
              The backend simulation engines stay in TypeScript. The migration
              target is the UI layer: replace Liquid plus inline scripts with a
              typed component model.
            </p>
          </div>
        </aside>

        <main className="px-5 py-8 sm:px-8 lg:px-10">{children}</main>
      </div>
    </div>
  );
}

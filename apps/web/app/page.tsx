import Link from "next/link";
import { Boxes, Component, Layers } from "lucide-react";
import { Button } from "@repo/ui/components/button";

const stack = [
  {
    title: "Next.js",
    description:
      "App Router, React Server Components, and file-based routing in apps/web.",
    icon: Boxes,
    href: "https://nextjs.org/docs",
    label: "Next.js docs",
  },
  {
    title: "Turborepo",
    description:
      "This app lives in a pnpm workspace monorepo with shared packages and turbo pipelines.",
    icon: Layers,
    href: "https://turbo.build/repo/docs",
    label: "Turborepo docs",
  },
  {
    title: "shadcn/ui",
    description:
      "Radix primitives and Tailwind, wired through components.json — the Button below is from your ui folder.",
    icon: Component,
    href: "https://ui.shadcn.com",
    label: "shadcn/ui",
  },
] as const;

export default function Page() {
  return (
    <div className="relative min-h-dvh">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,oklch(0.92_0_0),transparent)] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,oklch(0.3_0_0),transparent)]"
      />

      <div className="mx-auto flex min-h-dvh max-w-5xl flex-col px-6 py-16 sm:px-8">
        <header className="mb-16 flex flex-col gap-6 text-center sm:mb-20">
          <p className="text-muted-foreground text-sm font-medium tracking-wide uppercase">
            turbo-base · apps/web
          </p>
          <h1 className="text-foreground text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            Next.js in a Turborepo, styled with{" "}
            <span className="text-primary">shadcn/ui</span>
          </h1>
          <p className="text-muted-foreground mx-auto max-w-2xl text-pretty text-lg leading-relaxed">
            This page is the default route for the web app: a Next.js application
            inside your monorepo, with Tailwind CSS 4 and shadcn components
            (for example <code className="bg-muted rounded px-1.5 py-0.5 text-sm">@/components/ui/button</code>
            ).
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg">
              <Link href="https://nextjs.org/docs" rel="noopener noreferrer" target="_blank">
                Next.js docs
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="https://turbo.build/repo/docs" rel="noopener noreferrer" target="_blank">
                Turborepo docs
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link href="https://ui.shadcn.com/docs" rel="noopener noreferrer" target="_blank">
                shadcn docs
              </Link>
            </Button>
          </div>
        </header>

        <main className="flex flex-1 flex-col gap-10">
          <ul className="grid gap-4 sm:grid-cols-3">
            {stack.map((item) => (
              <li key={item.title}>
                <article className="bg-card text-card-foreground flex h-full flex-col rounded-xl border p-6 shadow-xs">
                  <div className="bg-muted text-foreground mb-4 inline-flex size-10 items-center justify-center rounded-lg">
                    <item.icon className="size-5" aria-hidden />
                  </div>
                  <h2 className="mb-2 font-semibold tracking-tight">{item.title}</h2>
                  <p className="text-muted-foreground mb-4 flex-1 text-sm leading-relaxed">
                    {item.description}
                  </p>
                  <Button asChild variant="ghost" className="mt-auto w-fit px-0">
                    <Link href={item.href} rel="noopener noreferrer" target="_blank">
                      {item.label}
                    </Link>
                  </Button>
                </article>
              </li>
            ))}
          </ul>

          <section
            aria-labelledby="shadcn-demo-heading"
            className="bg-muted/50 rounded-xl border p-6 sm:p-8"
          >
            <h2
              id="shadcn-demo-heading"
              className="mb-2 text-center text-sm font-medium tracking-wide uppercase"
            >
              shadcn component demo
            </h2>
            <p className="text-muted-foreground mb-6 text-center text-sm">
              Variant buttons from <code className="bg-background rounded px-1 py-0.5">components/ui/button</code>
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <Button variant="default">Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="link" asChild>
                <Link href="https://ui.shadcn.com/docs/components/button">Link</Link>
              </Button>
            </div>
          </section>
        </main>

        <footer className="mt-16 border-t pt-8 text-center text-sm">
          <div className="text-muted-foreground font-mono">
            Run <code className="bg-muted rounded px-1.5 py-0.5">pnpm dev --filter web</code> from the repo root
            (dev server defaults to port 3001 for this app).
          </div>
          <div className="text-muted-foreground font-mono text-xs">
            (Press <kbd>d</kbd> to toggle dark mode)
          </div>
        </footer>
      </div>
    </div>
  );
}

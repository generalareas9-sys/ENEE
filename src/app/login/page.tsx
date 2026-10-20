import Link from "next/link";
import { AuthForm } from "@/components/auth-form";
import { BackButton, Breadcrumb } from "@/components/breadcrumb";
import { SiteFooter } from "@/components/site-footer";
import { Brand, SiteHeader } from "@/components/site-header";
import { PageMotion } from "@/components/page-motion";
import { site } from "@/config/site";

export default function LoginPage() {
  const configured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);
  return (
    <>
      <SiteHeader />
      <PageMotion>
        <div className="mx-auto grid w-full max-w-6xl flex-1 items-center gap-10 px-5 py-12 sm:px-8 md:grid-cols-[.9fr_1.1fr] md:py-20">
          <aside className="hidden rounded-[2rem] bg-[#174d3c] p-10 text-white md:block">
            <Brand />
            <p className="mt-20 text-xs font-bold uppercase tracking-[0.18em] text-[#efd68c]">Welcome back</p>
            <h1 className="mt-4 font-display text-5xl font-semibold leading-tight">Pick up where your ambition takes you.</h1>
            <p className="mt-5 max-w-sm leading-7 text-white/70">Your entrance exam preparation path, organized for the next step.</p>
          </aside>
          <section className="mx-auto w-full max-w-lg">
            <BackButton href="/" label="Back to home" />
            <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Log in" }]} />
            <p className="text-sm font-bold uppercase tracking-[0.15em] text-primary">{site.shortName} student account</p>
            <h2 className="mt-2 font-display text-4xl font-semibold">Welcome back</h2>
            <p className="mt-2 text-muted-foreground">Log in to continue your video course.</p>
            {!configured && (
              <p role="status" className="mt-6 rounded-2xl border border-gold/30 bg-accent p-4 text-sm leading-6 text-accent-foreground">
                Setup needed: copy <code>.env.example</code> to <code>.env.local</code> and add your Supabase project credentials before signing in.
              </p>
            )}
            <div className="mt-7 rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-card)] sm:p-8">
              <AuthForm mode="login" />
            </div>
            <p className="mt-6 text-center text-sm text-muted-foreground">
              New to ENEE? <Link href="/register" className="font-bold text-primary underline-offset-4 hover:underline">Create an account</Link>
            </p>
          </section>
        </div>
      </PageMotion>
      <SiteFooter />
    </>
  );
}

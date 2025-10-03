import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { account } from "../lib/appwrite";

// A visually rich About page explaining the product, value, and technology.
export default function About() {
  const [authed, setAuthed] = useState(false);
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const me = await account.get();
        if (!mounted) return;
        const isAnon = me?.labels?.includes("anonymous");
        setAuthed(!!me && !isAnon);
      } catch {
        if (mounted) setAuthed(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);
  return (
    <div className="relative">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10 animated-glow-hues">
          <div className="glow-rotator" />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/15 to-pink-600/20" />
          {/* Layered radial glows with animation */}
          <div className="glow-layer glow-float absolute -top-40 -left-24 h-[34rem] w-[34rem] rounded-full bg-gradient-to-br from-blue-500/35 via-indigo-400/25 to-transparent blur-[150px]" />
          <div className="glow-layer glow-float absolute -bottom-64 -right-10 h-[42rem] w-[42rem] rounded-full bg-gradient-to-tr from-fuchsia-500/30 via-pink-500/25 to-transparent blur-[170px] animation-delay-2000" />
          <div className="glow-layer glow-float absolute top-1/3 left-1/2 -translate-x-1/2 h-[26rem] w-[26rem] rounded-full bg-gradient-to-br from-indigo-500/30 via-purple-500/25 to-transparent blur-[160px] animation-delay-4000" />
          {/* Grain + radial highlights */}
          <div className="grain-overlay" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.3),transparent_65%),radial-gradient(circle_at_75%_70%,rgba(255,255,255,0.15),transparent_70%)] mix-blend-overlay" />
        </div>
        <div className="mx-auto max-w-5xl px-6 pt-20 pb-16 md:pt-28 md:pb-24">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Make Your Resume ATS‑Ready
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              This platform analyzes your resume using modern AI and Applicant
              Tracking System heuristics. Get instant, actionable feedback on
              structure, keyword density, accomplishments, readability, and role
              alignment—then iterate faster.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/upload">
                <Button
                  size="lg"
                  className="text-white bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:brightness-110 shadow-lg shadow-purple-600/20"
                >
                  Analyze My Resume
                </Button>
              </Link>
              {!authed && (
                <Link to="/signup">
                  <Button variant="outline" size="lg" className="backdrop-blur">
                    Create Account
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="mx-auto max-w-6xl px-6 py-12 md:py-16">
        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
          Why It Matters
        </h2>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Recruiters spend seconds scanning resumes. Automated filters discard
          many before a human even looks. We bridge that gap with clarity,
          structure, keyword alignment, and AI‑assisted intelligence.
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="group relative overflow-hidden rounded-xl border bg-card p-5 shadow-sm transition hover:shadow-md"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-pink-600/10" />
              <div className="relative z-10">
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-md bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow">
                  {f.icon}
                </div>
                <h3 className="font-semibold text-lg">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {f.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tech Stack */}
      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-6xl px-6 py-14 md:py-20">
          <h2 className="text-2xl font-semibold md:text-3xl">Under the Hood</h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Built with modern, composable tooling for speed, reliability, and
            maintainability.
          </p>
          <ul className="mt-8 grid gap-4 text-sm sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {stack.map((s) => (
              <li
                key={s}
                className="rounded-md border bg-background/70 px-4 py-3 shadow-sm backdrop-blur transition hover:bg-background"
              >
                {s}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Mission */}
      <section className="mx-auto max-w-5xl px-6 py-14 md:py-20">
        <div className="grid items-start gap-10 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-semibold md:text-3xl">Our Mission</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              We want candidates to spend less energy guessing what “the
              algorithm” wants and more time telling authentic achievement
              stories. By fusing semantic analysis, structural validation, and
              ATS‑style parsing heuristics, we surface the signal—and reduce the
              noise.
            </p>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              This isn’t about writing your resume for you. It’s about
              augmenting your revision workflow with immediate, accountable
              insight.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/upload">
                <Button
                  size="sm"
                  className="bg-gradient-to-r text-white from-blue-600 via-purple-600 to-pink-600 hover:brightness-110"
                >
                  Try It Now
                </Button>
              </Link>
              {!authed && (
                <Link to="/signup">
                  <Button size="sm" variant="outline">
                    Create Account
                  </Button>
                </Link>
              )}
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 rounded-2xl bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20 blur-2xl" />
            <div className="relative rounded-xl border bg-background p-6 shadow-xl">
              <h3 className="font-semibold mb-3">How Analysis Works</h3>
              <ol className="space-y-3 text-sm text-muted-foreground">
                <li>
                  <span className="font-medium text-foreground">1.</span> We
                  extract clean text from your PDF (with OCR fallback for
                  scans).
                </li>
                <li>
                  <span className="font-medium text-foreground">2.</span> The
                  content is segmented into sections & bullet density patterns.
                </li>
                <li>
                  <span className="font-medium text-foreground">3.</span> AI
                  model scores structure, clarity, impact verbs, and keyword
                  alignment.
                </li>
                <li>
                  <span className="font-medium text-foreground">4.</span> We
                  calculate an overall ATS compatibility score.
                </li>
                <li>
                  <span className="font-medium text-foreground">5.</span> You
                  receive prioritized recommendations and improvement deltas.
                </li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-5xl px-6 pb-24">
        <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-px shadow-lg">
          <div className="rounded-2xl bg-background/90 px-8 py-12 backdrop-blur">
            <h2 className="text-2xl font-semibold text-center md:text-3xl text-white">
              Ready to Improve Your Resume?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground text-white">
              Upload a resume and get a full diagnostic score with structured
              feedback in under a minute.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-white">
              <Link to="/upload">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:brightness-110"
                >
                  Start Free Analysis
                </Button>
              </Link>
              {authed && (
                <Link to="/history">
                  <Button size="lg" variant="outline" className="backdrop-blur">
                    View Past Results
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

const features = [
  {
    title: "Structured Feedback",
    desc: "Targeted guidance on headings, bullet phrasing, metrics, and alignment to role expectations.",
    icon: <span className="text-lg">🧩</span>,
  },
  {
    title: "OCR + Parsing",
    desc: "Robust PDF text extraction with OCR fallback for scanned or image-based resumes.",
    icon: <span className="text-lg">📄</span>,
  },
  {
    title: "Keyword Insight",
    desc: "Detects missing role-critical terminology and suggests additions without keyword stuffing.",
    icon: <span className="text-lg">🔍</span>,
  },
  {
    title: "Impact Emphasis",
    desc: "Highlights weak verbs and vague statements so you can replace them with quantifiable achievements.",
    icon: <span className="text-lg">🚀</span>,
  },
  {
    title: "Compatibility Score",
    desc: "Aggregated scoring model reflecting ATS readability, structure validity, and content strength.",
    icon: <span className="text-lg">📊</span>,
  },
  {
    title: "Privacy First",
    desc: "We only store what’s needed for your analysis history—delete anytime.",
    icon: <span className="text-lg">🔒</span>,
  },
];

const stack = [
  "React Router 7",
  "TypeScript",
  "Tailwind + Utility Tokens",
  "shadcn/ui primitives",
  "Appwrite Auth & DB",
  "Appwrite Storage",
  "Gemini Models",
  "pdf.js + OCR (Tesseract.js)",
  "Edge-friendly Parsing",
  "Progressive Enhancement",
];

"use client";

import { motion } from "framer-motion";

function AnimatedSection({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const stats = [
  { value: "40+", label: "TOOLS" },
  { value: "7", label: "CATEGORIES" },
  { value: "0", label: "SERVERS" },
  { value: "100%", label: "PRIVATE" },
];

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-16 space-y-16">
      {/* Hero */}
      <AnimatedSection className="bg-primary border-b-2 border-foreground py-16 text-center">
        <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight section-heading mb-4">
          About ToolsHub
        </h1>
        <p className="text-lg max-w-2xl mx-auto">
          A premium collection of browser-based tools that respects your privacy.
        </p>
      </AnimatedSection>

      {/* Mission */}
      <AnimatedSection>
        <div className="card-bold p-6 md:p-8">
          <h2 className="text-xl font-black uppercase tracking-tight section-heading mb-4">
            Why We Built This
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Most online tool platforms require you to upload your files to their servers.
            We believe that&apos;s a privacy risk you shouldn&apos;t have to take. ToolsHub was built
            to prove that powerful, useful tools can exist without compromising your data.
            Every tool runs entirely in your browser — your files never leave your device.
          </p>
        </div>
      </AnimatedSection>

      {/* How It Works */}
      <AnimatedSection>
        <h2 className="text-xl font-black uppercase tracking-tight section-heading mb-6">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card-bold p-6 text-center">
            <div className="text-4xl font-black mb-2">1</div>
            <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              SELECT YOUR TOOL
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Choose from 37+ tools across 7 categories
            </p>
          </div>
          <div className="card-bold p-6 text-center">
            <div className="text-4xl font-black mb-2">2</div>
            <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              PROCESS IN BROWSER
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              All processing happens locally on your device
            </p>
          </div>
          <div className="card-bold p-6 text-center">
            <div className="text-4xl font-black mb-2">3</div>
            <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              DOWNLOAD RESULT
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Get your result instantly, no waiting
            </p>
          </div>
        </div>
      </AnimatedSection>

      {/* Stats */}
      <AnimatedSection>
        <h2 className="text-xl font-black uppercase tracking-tight section-heading mb-6">
          By The Numbers
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className="card-bold p-4 text-center"
            >
              <div className="text-2xl font-black">{stat.value}</div>
              <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </AnimatedSection>

      {/* Open Source */}
      <AnimatedSection>
        <div className="card-bold p-6 md:p-8 text-center bg-foreground text-background">
          <h2 className="text-xl font-black uppercase tracking-tight section-heading mb-4">
            Open Source
          </h2>
          <p className="text-background/80 mb-6">
            ToolsHub is open source and available on GitHub.
            Feel free to contribute, report issues, or suggest new tools.
          </p>
          <a
            href="https://github.com/technicalboy2023/toolhub"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 border-2 border-background bg-primary text-foreground font-bold hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px] transition-all"
          >
            View Source Code
          </a>
        </div>
      </AnimatedSection>
    </div>
  );
}

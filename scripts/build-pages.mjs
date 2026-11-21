#!/usr/bin/env node
/**
 * Build the documentation site and a synthetic enterprise demo for GitHub Pages.
 *
 * Pattern adapted from Central Agentic Ops:
 *   npm run dashboard:pages:build
 *   https://githubnext.github.io/gh-cao/deployment-actions/#building-the-synthetic-pages-demo
 *
 * This builder accepts no real-data input. Output lives under dist/, with
 * synthetic sample files under dist/demo-data/ (not a root manifest). The
 * pages declare themselves a Synthetic enterprise demo and expose no live
 * services. This is a Warble-sized static adaptation; it does not vendor the
 * gh-cao dashboard, Go/PostgreSQL host, Web Worker, or IndexedDB pipeline.
 */
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const rawBase = process.env.BASE_PATH || "/";
const basePath = rawBase.endsWith("/") ? rawBase : `${rawBase}/`;
const commit = process.env.PUBLIC_PAGES_BUILD_COMMIT || "local";
const builtAt = new Date().toISOString();
const utcDay = builtAt.slice(0, 10);

function asset(path) {
  return `${basePath}${path.replace(/^\//, "")}`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

/** Mulberry32, seeded so a given UTC day is reproducible. */
function rng(seed) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function hashDay(day) {
  let h = 2166136261;
  for (const ch of day) {
    h ^= ch.charCodeAt(0);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

const REPOS = [
  "demo-shop-frontend",
  "demo-shop-api",
  "demo-payments",
  "demo-inventory",
  "demo-identity",
  "demo-observability",
  "demo-docs",
  "demo-policy",
  "demo-edge",
  "demo-data-plane",
  "demo-workflows",
  "demo-release",
];

const WORKFLOWS = [
  "issue-triage",
  "ci-investigator",
  "docs-maintainer",
  "pr-reviewer",
  "daily-status",
];

const CAMPAIGNS = [
  "Campaign A — reliability",
  "Campaign B — documentation",
  "Campaign C — review quality",
];

function generateSyntheticSample(day) {
  const rand = rng(hashDay(`synthetic-demo-${day}`));
  const start = Date.parse(`${day}T00:00:00Z`) - 20 * 24 * 60 * 60 * 1000;
  const runs = [];
  const perRepo = Object.fromEntries(REPOS.map((name) => [name, { name, runs: 0, failures: 0 }]));

  for (let i = 0; i < 72; i += 1) {
    const repo = REPOS[Math.floor(rand() * REPOS.length)];
    const workflow = WORKFLOWS[Math.floor(rand() * WORKFLOWS.length)];
    const campaign = CAMPAIGNS[Math.floor(rand() * CAMPAIGNS.length)];
    const offset = Math.floor(rand() * 21 * 24 * 60);
    const started = new Date(start + offset * 60 * 1000).toISOString();
    const failed = rand() < 0.16;
    const durationSec = Math.round(40 + rand() * 1800);
    const tokens = Math.round(8_000 + rand() * 120_000);
    runs.push({
      id: `syn-${day.replaceAll("-", "")}-${String(i + 1).padStart(3, "0")}`,
      repo,
      workflow,
      campaign,
      started,
      outcome: failed ? "failure" : "success",
      durationSec,
      tokens,
    });
    perRepo[repo].runs += 1;
    if (failed) perRepo[repo].failures += 1;
  }

  runs.sort((a, b) => a.started.localeCompare(b.started));
  const failures = runs.filter((run) => run.outcome === "failure").length;
  return {
    kind: "synthetic-enterprise-demo",
    namespace: "demo-data",
    storageKeySuffix: "synthetic-demo",
    generatedForUtcDay: day,
    note: "Illustrative distributions only. Not operational evidence, fitted telemetry, or a price quotation.",
    campaigns: CAMPAIGNS,
    repositories: REPOS.length,
    workflows: WORKFLOWS.length,
    runs: runs.length,
    failures,
    inventory: Object.values(perRepo),
    sample: runs,
  };
}

function layout({ title, banner, body }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="Warble Cloud organization profile and a synthetic GitHub Pages demo. The demo is not operational evidence.">
  <title>${escapeHtml(title)}</title>
  <link rel="icon" href="${asset("assets/favicon.ico")}">
  <link rel="stylesheet" href="${asset("styles.css")}">
</head>
<body>
  ${banner}
  <header class="site wrap">
    <a class="brand" href="${asset("")}">
      <img src="${asset("assets/warble-logo.png")}" alt="Warble Cloud">
    </a>
    <nav aria-label="Site">
      <a href="${asset("")}">Overview</a>
      <a href="${asset("demo/")}">Synthetic demo</a>
      <a href="https://github.com/warbletech">GitHub org</a>
      <a href="https://warbleoss.org">warbleoss.org</a>
      <a href="https://warblecloud.com">warblecloud.com</a>
    </nav>
  </header>
  ${body}
  <footer class="site wrap">
    <p>Silver member of The Linux Foundation and the Agentic AI Foundation. Core Tech Member of the AAIF working groups: Taxonomy &amp; Landscape; Observability &amp; Tracing (Agent State, Context, and Reasoning); Identity &amp; Trust; Governance, Risk &amp; Regulatory; and Agentic Commerce. AAIF Tech Speaker.</p>
    <p>Commercial surface: <a href="https://warblecloud.com">warblecloud.com</a>. OSS home: <a href="https://warbleoss.org">warbleoss.org</a>. Build ${escapeHtml(commit.slice(0, 7))} at ${escapeHtml(builtAt)}.</p>
  </footer>
</body>
</html>
`;
}

const MEMBERSHIP_BANNER = "";

function logo(href, src, alt) {
  return `<a href="${escapeHtml(href)}"><img src="${asset(`assets/${src}`)}" alt="${escapeHtml(alt)}"><span>${escapeHtml(alt)}</span></a>`;
}

const sample = generateSyntheticSample(utcDay);

const indexBody = `
  <main class="wrap">
    <section class="hero">
      <h1>Warble Cloud</h1>
      <p>A premium cloud + AI platform by ChirpStack LLP (India) and WarbleCloud LLC (United States) — Ruffle MCP, Reflexion, FRAKMA, Avirka, and warble-flock. Public work lives in this organization and at <a href="https://warbleoss.org">warbleoss.org</a>; the commercial platform is at <a href="https://warblecloud.com">warblecloud.com</a>.</p>
      <div class="members">
        <a href="https://www.linuxfoundation.org/"><img class="lf" src="${asset("assets/lf-horizontal-white.svg")}" alt="The Linux Foundation"></a>
        <a href="https://aaif.io/"><img src="${asset("assets/aaif-wordmark.svg")}" alt="Agentic AI Foundation" style="background:#fff;border-radius:6px;padding:0.25rem 0.4rem;"></a>
      </div>
      <p>Silver member of The Linux Foundation and the Agentic AI Foundation (AAIF).</p>
      <p>Core Tech Member of the AAIF working groups: Taxonomy &amp; Landscape; Observability &amp; Tracing (Agent State, Context, and Reasoning); Identity &amp; Trust; Governance, Risk &amp; Regulatory; and Agentic Commerce. AAIF Tech Speaker.</p>
      <ul class="chips" aria-label="AAIF working groups and Tech Speaker">
        <li>Taxonomy &amp; Landscape</li>
        <li>Observability &amp; Tracing</li>
        <li>Identity &amp; Trust</li>
        <li>Governance, Risk &amp; Regulatory</li>
        <li>Agentic Commerce</li>
        <li>Tech Speaker</li>
      </ul>
    </section>

    <div class="logo-strip" aria-label="Project and product marks">
      ${logo("https://warblecloud.com", "warble-logo.png", "Warble Cloud")}
      ${logo("https://warblecloud.com/products", "logo-reflexion.svg", "Reflexion")}
      ${logo("https://warblecloud.com/products", "logo-frakmax.svg", "FRAKMA-X")}
      ${logo("https://warblecloud.com/products", "logo-warble-brain.svg", "Warble-brain")}
      ${logo("https://warbleoss.org/#flock", "shrike-ops-logo.jpg", "ShrikeOps")}
      ${logo("https://warbleoss.org/#flock", "heron-ops-logo.jpg", "Heron Ops")}
      ${logo("https://github.com/warbletech/warble-linux", "warble-linux-logo.jpg", "warble-linux")}
      ${logo("https://warbleoss.org", "warble-icon.png", "warble-flock")}
    </div>

    <section class="soon">
      <h2>Coming soon</h2>
      <div class="grid">
        <article class="card"><span class="tag">Coming soon</span><h3>Reusable GitHub agentic workflows</h3><p>This site follows the <a href="https://githubnext.github.io/gh-cao/deployment-actions/#building-the-synthetic-pages-demo">gh-cao Documentation Pages</a> pattern: documentation plus a synthetic demo, with no operational evidence. Broader <a href="https://github.com/githubnext/agentics">agentics</a> / gh-aw adoption across the org is still ahead.</p></article>
        <article class="card"><span class="tag">Coming soon</span><h3>warble-flock rename</h3><p>The product formerly called Warble Army is now warble-flock. Name rollout is tracked in <a href="https://github.com/warbletech/warble-core/issues/272">warble-core#272</a>. The public umbrella repo is still <a href="https://github.com/warbletech/warble-army">warbletech/warble-army</a>.</p></article>
        <article class="card"><span class="tag">Coming soon</span><h3>Ruffle MCP community project</h3><p>User-facing copy now says Ruffle MCP (formerly Starling MCP), after <a href="https://github.com/warbletech/warble-core/pull/262">warble-core#262</a>. The public repositories are still <code>starling</code> and <code>starling-community</code>.</p></article>
        <article class="card"><span class="tag">Coming soon</span><h3>CNCF Sandbox application</h3><p>A draft lives at <a href="https://github.com/warbletech/warble-army/blob/main/docs/cncf/SANDBOX_APPLICATION.md">docs/cncf/SANDBOX_APPLICATION.md</a>. The flock is not a CNCF project until the TOC accepts an application filed on <a href="https://github.com/cncf/sandbox">cncf/sandbox</a>.</p></article>
        <article class="card"><span class="tag">Coming soon</span><h3>FRAKMA-X Linux Foundation wing</h3><p><a href="https://warbleoss.org">warbleoss.org</a> describes the Frakma-X LF wing as forming, separate from the commercial FRAKMA surface at <a href="https://frakma.io">frakma.io</a>.</p></article>
      </div>
    </section>
  </main>
`;

const inventoryRows = sample.inventory
  .map((row) => {
    const width = Math.max(8, Math.round((row.runs / 12) * 100));
    return `<tr><td>${escapeHtml(row.name)}</td><td>${row.runs}</td><td class="${row.failures ? "fail" : "ok"}">${row.failures}</td><td><div class="bar" aria-hidden="true"><span style="width:${width}%"></span></div></td></tr>`;
  })
  .join("");

const runRows = sample.sample
  .slice(-12)
  .reverse()
  .map((run) => {
    const klass = run.outcome === "failure" ? "fail" : "ok";
    return `<tr><td>${escapeHtml(run.started.replace("T", " ").slice(0, 16))}Z</td><td>${escapeHtml(run.repo)}</td><td>${escapeHtml(run.workflow)}</td><td class="${klass}">${escapeHtml(run.outcome)}</td><td>${run.durationSec}s</td></tr>`;
  })
  .join("");

const demoBody = `
  <div class="banner" role="status">Synthetic enterprise demo — generated sample data only. This is not evidence about any Warble or customer control repository, and no live services are connected.</div>
  <main class="wrap">
    <section class="hero">
      <h1>Synthetic enterprise demo</h1>
      <p>Built with the Central Agentic Ops Pages boundary: the builder accepts no real-data input, writes samples under <code>demo-data/</code>, and rebuilds independently of operational collection. Figures below are illustrative distributions for UTC day <strong>${escapeHtml(utcDay)}</strong>.</p>
    </section>
    <div class="grid" style="padding-bottom:1.5rem">
      <article class="card"><h3>Repositories</h3><p style="font-size:2rem;color:var(--ink);margin:0">${sample.repositories}</p><p>Named with a <code>demo-</code> prefix on purpose.</p></article>
      <article class="card"><h3>Campaigns</h3><p style="font-size:2rem;color:var(--ink);margin:0">${sample.campaigns.length}</p><p>${escapeHtml(sample.campaigns.join(" · "))}</p></article>
      <article class="card"><h3>Agentic workflow runs</h3><p style="font-size:2rem;color:var(--ink);margin:0">${sample.runs}</p><p>${sample.failures} illustrative failures over 21 days.</p></article>
    </div>
    <section class="card" style="margin-bottom:1rem">
      <h2>Fleet inventory</h2>
      <table>
        <thead><tr><th>Repository</th><th>Runs</th><th>Failures</th><th>Activity</th></tr></thead>
        <tbody>${inventoryRows}</tbody>
      </table>
    </section>
    <section class="card" style="margin-bottom:2rem">
      <h2>Latest sample runs</h2>
      <table>
        <thead><tr><th>Started (UTC)</th><th>Repository</th><th>Workflow</th><th>Outcome</th><th>Duration</th></tr></thead>
        <tbody>${runRows}</tbody>
      </table>
      <p>Machine-readable sample: <a href="${asset("demo-data/manifest.json")}">demo-data/manifest.json</a>.</p>
    </section>
  </main>
`;

rmSync(dist, { recursive: true, force: true });
mkdirSync(join(dist, "demo-data"), { recursive: true });
mkdirSync(join(dist, "demo"), { recursive: true });
cpSync(join(root, "profile", "assets"), join(dist, "assets"), { recursive: true });
// Keep provenance docs in git; do not publish them as a Pages asset.
try {
  rmSync(join(dist, "assets", "LOGOS.md"));
} catch {
  // optional file
}
cpSync(join(root, "pages", "styles.css"), join(dist, "styles.css"));

writeFileSync(
  join(dist, "index.html"),
  layout({ title: "Warble Cloud — organization profile", banner: MEMBERSHIP_BANNER, body: indexBody }),
  "utf8",
);
writeFileSync(
  join(dist, "demo", "index.html"),
  layout({ title: "Synthetic enterprise demo — Warble Cloud", banner: "", body: demoBody }),
  "utf8",
);
writeFileSync(
  join(dist, "404.html"),
  layout({
    title: "Page not found — Warble Cloud",
    banner: "",
    body: `<main class="wrap hero"><h1>Page not found</h1><p>This GitHub Pages site only publishes the organization overview and a <a href="${asset("demo/")}">synthetic enterprise demo</a>.</p></main>`,
  }),
  "utf8",
);

const manifest = {
  kind: sample.kind,
  namespace: sample.namespace,
  storageKeySuffix: sample.storageKeySuffix,
  generatedForUtcDay: sample.generatedForUtcDay,
  note: sample.note,
  campaigns: sample.campaigns,
  repositories: sample.repositories,
  workflows: sample.workflows,
  runs: sample.runs,
  failures: sample.failures,
  commit,
  builtAt,
  inventory: sample.inventory,
};
writeFileSync(join(dist, "demo-data", "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
writeFileSync(join(dist, "demo-data", "runs.json"), `${JSON.stringify(sample.sample, null, 2)}\n`, "utf8");

const bytes = ["index.html", "demo/index.html", "demo-data/manifest.json", "styles.css"]
  .map((rel) => `${rel} (${readFileSync(join(dist, rel)).length} bytes)`)
  .join(", ");
console.log(`Built synthetic Pages site at ${dist} with base path ${basePath}`);
console.log(bytes);

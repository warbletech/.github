# Logos used on the GitHub org profile

## Official flock marks (warbleoss.org + warble-army brand README)

These two files are byte-identical on https://warbleoss.org/assets/ and in
https://github.com/warbletech/warble-army/tree/main/brand (see `brand/README.md`).

| File | Product | Source |
|------|---------|--------|
| `shrike-ops-logo.jpg` | ShrikeOps | warbleoss.org/assets/shrike-ops-logo.jpg · brand/shrike-ops/shrike-ops-logo.jpg |
| `heron-ops-logo.jpg` | Heron Ops | warbleoss.org/assets/heron-ops-logo.jpg · brand/heron-ops/heron-ops-logo.jpg |

warbleoss.org has no unique community self-host chart mark (the landing page reuses the Heron Ops logo at reduced opacity). A 1024² `starling_logo.jpg` exists in `warbletech/shrikeops`, but it has a checkerboard baked into the JPEG (documented in warble-linux `assets/brand/README.md`) and is not used here.

## Other project marks

| File | Product | Source |
|------|---------|--------|
| `warble-linux-logo.jpg` | warble-linux | `logo.jpg` at the root of https://github.com/warbletech/warble-linux |
| `logo-starling.svg` | Historical Starling fitment mark, kept in this folder, not used as a hero or as a Ruffle MCP stand-in | Fitment inline SVG (warbleoss.org has none) |
| `warble-icon.png` | warble-flock, Ruffle MCP (stand-in), and warble-bootstrap (no unique official mark yet) | Site icon from warblecloud.com (no unique official Ruffle MCP, warble-flock, or warble-bootstrap mark was found in warbletech repos) |

## Fitment product marks (Platform section)

Extracted from https://warblecloud.com/fitment (inline SVGs) plus site-wide rasters the page references: `logo-*.svg`, `warble-logo.png`, `warble-icon.png`, `logo-192.png`, `logo-512.png`, `og-image.jpg`, favicons.

| File | Product | Source |
|------|---------|--------|
| `logo-reflexion.svg` | Reflexion | Fitment inline SVG, already in this folder |
| `logo-frakmax.svg` | FRAKMA / FRAKMA-X | Fitment inline SVG, already in this folder |
| `logo-warble-brain.svg` | Warble-brain; also used as a stand-in next to Avirka (no unique official Avirka mark was found in warbletech repos) | Fitment inline SVG, already in this folder |
| `logo-hummingbird.svg` | Hummingbird | Fitment inline SVG, already in this folder |
| `logo-finops.svg` | FinOps | Fitment inline SVG, already in this folder |
| `logo-sovereign-agent.svg` | Sovereign Agent | Fitment inline SVG, already in this folder |

## Membership marks (copied from warbletech/warble-core)

These files are copied from `apps/frontend/public/logos/` in [warbletech/warble-core](https://github.com/warbletech/warble-core/tree/main/apps/frontend/public/logos), where they are already used on the commercial site partner strip. They are official Linux Foundation and Agentic AI Foundation artwork, not invented marks. Usage should follow each foundation's brand guidelines.

| File | Organization | Source |
|------|--------------|--------|
| `lf-horizontal-color.svg` | The Linux Foundation (horizontal color wordmark) | warble-core `apps/frontend/public/logos/lf-horizontal-color.svg` |
| `lf-horizontal-white.svg` | The Linux Foundation (horizontal white wordmark, for dark backgrounds on the Pages demo) | warble-core `apps/frontend/public/logos/lf-horizontal-white.svg` |
| `aaif-wordmark.svg` | Agentic AI Foundation (primary wordmark) | warble-core `apps/frontend/public/logos/aaif-wordmark.svg` |
| `aaif-mark.svg` | Agentic AI Foundation (symbol) | warble-core `apps/frontend/public/logos/aaif-mark.svg` |

Official brand pages: [Linux Foundation Brand Guidelines](https://www.linuxfoundation.org/brand-guidelines), [AAIF Brand Guidelines](https://aaif.io/brand).

## Marks added from supplied artwork (21 November 2026)

Avinash supplied full-size PNG masters. They were cropped to the artwork (near-white
margins removed, background made transparent), resized to 512×512 and 256×256, and
compressed with pngquant + optipng. Masters larger than 1MB were not committed.

| File | Product | Link | Source |
|------|---------|------|--------|
| `logo-warbleoss.png` (512) · `logo-warbleoss-256.png` | WarbleOSS / warbleoss.org | https://warbleoss.org | Supplied `warbleoss.png` (teal/navy bird wing, 2048², ~1.8MB; not committed) |
| `logo-warble-community.png` (512) · `logo-warble-community-256.png` | Warble Community | https://github.com/warbletech/community | Supplied `warble-community.png` (coral + teal birds/nodes, 1024²) |
| `logo-k8s-ai-conformance.png` (512) · `logo-k8s-ai-conformance-256.png` | Kubernetes AI Conformance | https://github.com/cncf/k8s-ai-conformance | Supplied `k8s-ai-conformance.png` (blue hex shield + checkmark, 2048², ~4MB; not committed) |

`warbletech/k8s-ai-conformance` is a fork of `cncf/k8s-ai-conformance`. Warble's
[PR #131](https://github.com/cncf/k8s-ai-conformance/pull/131) merged on 29 October 2026.

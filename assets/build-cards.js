const fs = require("fs");
const path = require("path");
const si = require("simple-icons");

/**
 * Project cards, generated rather than fetched.
 *
 * Socialify was tried first and rejected: its `logo` parameter is accepted but
 * silently dropped, so every card fell back to the repo's language glyph and
 * DNCC (no detected language) rendered with nothing at all. Drawing the cards
 * here means the stack icons are exactly the ones each project actually uses.
 *
 * Icon paths come from simple-icons at build time, so they are real vendor
 * marks rather than hand-drawn approximations.
 */

const INK = "#e7edf2";
const DIM = "#9aa8b5";
const FAINT = "#6b7a88";
const ACCENT = "#22d3ee";
const BG = "#0b0f14";
const LINE = "#1a2229";
const PANEL = "#10151b";

const W = 420;
const H = 190;

const PROJECTS = [
  {
    file: "card-reelnn.svg",
    name: "reelnn",
    note: "Telegram as the storage backend",
    stars: "88",
    forks: "66",
    stack: ["siTypescript", "siNextdotjs", "siFastapi", "siMongodb", "siTelegram"],
  },
  {
    file: "card-hartrace.svg",
    name: "hartrace",
    note: "MCP server, published on PyPI",
    stars: "0",
    forks: "1",
    stack: ["siPython", "siPydantic", "siAnthropic"],
  },
  {
    file: "card-reelnn-backend.svg",
    name: "reelnn-backend",
    note: "FastAPI service behind reelnn",
    stars: "18",
    forks: "33",
    stack: ["siPython", "siFastapi", "siMongodb", "siDocker"],
  },
  {
    file: "card-dncc.svg",
    name: "DNCC Waste Management",
    note: "Dhaka North City Corporation",
    stars: "0",
    forks: "0",
    stack: ["siReact", "siFastapi", "siMongodb"],
  },
];

/** Vendor marks that are black or near-black disappear here, so they use ink. */
function colorFor(icon) {
  const n = parseInt(icon.hex, 16);
  const lum =
    0.2126 * ((n >> 16) & 255) + 0.7152 * ((n >> 8) & 255) + 0.0722 * (n & 255);
  return lum < 55 ? INK : `#${icon.hex}`;
}

function card(p) {
  const icons = p.stack
    .map((key, i) => {
      const icon = si[key];
      if (!icon) throw new Error(`unknown icon: ${key}`);
      const x = 26 + i * 34;
      return `<g transform="translate(${x} 128) scale(0.92)" opacity="0">
      <animate attributeName="opacity" from="0" to="1" dur="0.4s" begin="${0.5 + i * 0.08}s" fill="freeze"/>
      <path d="${icon.path}" fill="${colorFor(icon)}"/>
    </g>`;
    })
    .join("\n    ");

  // A star count of zero reads worse than no figure, so it is dropped.
  const showStars = p.stars !== "0";
  const showForks = p.forks !== "0";
  const metrics = [
    showStars
      ? `<text x="${W - 26}" y="147" text-anchor="end" font-family="ui-monospace,monospace" font-size="20" font-weight="700" fill="${INK}">${p.stars}<tspan font-size="9.5" font-weight="400" fill="${FAINT}" dx="5">STARS</tspan></text>`
      : "",
    showForks
      ? `<text x="${W - 26}" y="166" text-anchor="end" font-family="ui-monospace,monospace" font-size="20" font-weight="700" fill="${DIM}">${p.forks}<tspan font-size="9.5" font-weight="400" fill="${FAINT}" dx="5">FORKS</tspan></text>`
      : "",
  ].join("\n    ");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="${p.name}. ${p.note}. ${p.stars} stars, ${p.forks} forks.">
  <defs>
    <linearGradient id="beam" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${ACCENT}" stop-opacity="0"/>
      <stop offset="0.5" stop-color="${ACCENT}" stop-opacity="0.9"/>
      <stop offset="1" stop-color="${ACCENT}" stop-opacity="0"/>
    </linearGradient>
    <clipPath id="clip"><rect width="${W}" height="${H}" rx="7"/></clipPath>
  </defs>

  <g clip-path="url(#clip)">
    <rect width="${W}" height="${H}" fill="${PANEL}"/>
    <rect x="0" y="0" width="${W}" height="4" fill="${BG}"/>

    <rect x="0" y="0" width="130" height="2" fill="url(#beam)">
      <animate attributeName="x" values="-130;${W}" dur="6s" repeatCount="indefinite"/>
    </rect>

    <text x="26" y="58" font-family="ui-monospace,'JetBrains Mono',monospace"
          font-size="23" font-weight="700" fill="${INK}">${p.name}</text>
    <text x="26" y="82" font-family="ui-monospace,'JetBrains Mono',monospace"
          font-size="11.5" fill="${DIM}">${p.note}</text>

    <line x1="26" y1="104" x2="${W - 26}" y2="104" stroke="${LINE}" stroke-width="1"/>

    ${icons}
    ${metrics}

    <rect width="${W}" height="${H}" rx="7" fill="none" stroke="${LINE}" stroke-width="2"/>
  </g>
</svg>`;
}

const out = process.argv[2] || ".";
PROJECTS.forEach((p) => {
  fs.writeFileSync(path.join(out, p.file), card(p));
  console.log("wrote", p.file);
});

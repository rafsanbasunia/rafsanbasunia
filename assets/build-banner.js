const fs = require("fs");

/**
 * Custom profile banner, generated rather than fetched.
 *
 * Every widget service produces the same card on thousands of profiles. This
 * is drawn from the portfolio's own tokens, so the README and rafsan.me read
 * as one system. SMIL animation is used because GitHub strips <style> and
 * <script> from README SVGs but leaves <animate> intact.
 */

const INK = "#e7edf2";
const DIM = "#9aa8b5";
const FAINT = "#6b7a88";
const ACCENT = "#22d3ee";
const BG = "#0b0f14";
const LINE = "#1a2229";

const W = 860;
const H = 260;

// Blueprint grid, matching the portfolio substrate.
let grid = "";
for (let x = 0; x <= W; x += 43) {
  grid += `<line x1="${x}" y1="0" x2="${x}" y2="${H}" stroke="${LINE}" stroke-width="1"/>`;
}
for (let y = 0; y <= H; y += 43) {
  grid += `<line x1="0" y1="${y}" x2="${W}" y2="${y}" stroke="${LINE}" stroke-width="1"/>`;
}

/** A stat block: large mono figure over a small caps label. */
function stat(x, y, value, label, delay) {
  return `
  <g opacity="0">
    <animate attributeName="opacity" from="0" to="1" dur="0.5s" begin="${delay}s" fill="freeze"/>
    <text x="${x}" y="${y}" font-family="ui-monospace,'JetBrains Mono',monospace"
          font-size="27" font-weight="700" fill="${INK}">${value}</text>
    <text x="${x}" y="${y + 19}" font-family="ui-monospace,'JetBrains Mono',monospace"
          font-size="10.5" letter-spacing="1.6" fill="${FAINT}">${label}</text>
  </g>`;
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Rafsan Hossen Basunia, backend and full-stack engineer. 107 stars, 102 forks, 22 repositories, 5 languages.">
  <defs>
    <linearGradient id="fade" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${ACCENT}" stop-opacity="0"/>
      <stop offset="0.5" stop-color="${ACCENT}" stop-opacity="1"/>
      <stop offset="1" stop-color="${ACCENT}" stop-opacity="0"/>
    </linearGradient>
    <clipPath id="frame"><rect width="${W}" height="${H}" rx="8"/></clipPath>
  </defs>

  <g clip-path="url(#frame)">
    <rect width="${W}" height="${H}" fill="${BG}"/>
    <g opacity="0.5">${grid}</g>

    <!-- Accent sweep across the top edge, travelling left to right. -->
    <rect x="0" y="0" width="240" height="2" fill="url(#fade)">
      <animate attributeName="x" values="-240;${W}" dur="7s" repeatCount="indefinite"/>
    </rect>

    <text x="44" y="62" font-family="ui-monospace,'JetBrains Mono',monospace"
          font-size="11" letter-spacing="2.4" fill="${ACCENT}">RAFSAN HOSSEN BASUNIA</text>

    <!-- Headline, wiped in by an expanding clip rather than a fade. -->
    <clipPath id="wipe">
      <rect x="44" y="72" width="0" height="60">
        <animate attributeName="width" from="0" to="700" dur="1.1s" begin="0.2s"
                 fill="freeze" calcMode="spline" keySplines="0.16 1 0.3 1"/>
      </rect>
    </clipPath>
    <g clip-path="url(#wipe)">
      <text x="44" y="112" font-family="ui-monospace,'JetBrains Mono',monospace"
            font-size="30" font-weight="700" fill="${INK}">Building systems that</text>
    </g>
    <clipPath id="wipe2">
      <rect x="44" y="118" width="0" height="60">
        <animate attributeName="width" from="0" to="700" dur="1.1s" begin="0.45s"
                 fill="freeze" calcMode="spline" keySplines="0.16 1 0.3 1"/>
      </rect>
    </clipPath>
    <g clip-path="url(#wipe2)">
      <text x="44" y="152" font-family="ui-monospace,'JetBrains Mono',monospace"
            font-size="30" font-weight="700" fill="${INK}">survive <tspan fill="${ACCENT}">bad input</tspan>.</text>
    </g>

    <line x1="44" y1="182" x2="${W - 44}" y2="182" stroke="${LINE}" stroke-width="1"/>

    ${stat(44, 216, "107", "STARS", 1.0)}
    ${stat(190, 216, "102", "FORKS", 1.15)}
    ${stat(336, 216, "22", "REPOSITORIES", 1.3)}
    ${stat(510, 216, "5", "LANGUAGES", 1.45)}

    <g opacity="0">
      <animate attributeName="opacity" from="0" to="1" dur="0.5s" begin="1.6s" fill="freeze"/>
      <text x="${W - 44}" y="216" text-anchor="end"
            font-family="ui-monospace,'JetBrains Mono',monospace"
            font-size="11.5" fill="${DIM}">rafsan.me</text>
      <text x="${W - 44}" y="235" text-anchor="end"
            font-family="ui-monospace,'JetBrains Mono',monospace"
            font-size="10.5" letter-spacing="1.2" fill="${FAINT}">DHAKA, BANGLADESH</text>
    </g>

    <rect width="${W}" height="${H}" rx="8" fill="none" stroke="${LINE}" stroke-width="2"/>
  </g>
</svg>`;

fs.writeFileSync(process.argv[2] || "banner.svg", svg);
console.log("written:", (svg.length / 1024).toFixed(1) + "KB");

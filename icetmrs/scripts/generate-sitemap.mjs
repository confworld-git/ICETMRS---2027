
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PUBLIC_DIR = path.resolve(__dirname, "../public");

const SITE_URL = "https://icetmrs.confworld.org";

// Add all actual public React Router paths here.
const routes = [
  "/",
  "/about-icetmrs",
  "/about-organizer",
  "/speakerlist",
  "/speakers",
  "/exhibits-and-sponsors",
  "/organizing-committee-member",
  "/organizinglist",
  "/organizing-committee-member-form",
  "/session-tracks-call-for-papers",
  "/essential-download",
  "/submission-guidelines",
  "/abstract-full-paper-submission",
  "/publication",
  "/registration-fees",
  "/available-payments",
  "/registration-instruction",
  "/terms-and-conditions",
  "/faq",
  "/venue",
  "/contact-us",
  "/academic-partner",
];

const escapeXml = (value) =>
  value.replace(/[<>&'"]/g, (char) => ({
    "<": "&lt;",
    ">": "&gt;",
    "&": "&amp;",
    "'": "&apos;",
    '"': "&quot;",
  })[char]);

const today = new Date().toISOString().split("T")[0];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map((route) => `  <url>
    <loc>${escapeXml(SITE_URL + route)}</loc>
    <lastmod>${today}</lastmod>
  </url>`)
  .join("\n")}
</urlset>`;

const robots = `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;

fs.mkdirSync(PUBLIC_DIR, { recursive: true });

fs.writeFileSync(
  path.join(PUBLIC_DIR, "sitemap.xml"),
  sitemap,
  "utf8"
);

fs.writeFileSync(
  path.join(PUBLIC_DIR, "robots.txt"),
  robots,
  "utf8"
);

console.log("ICETMRS sitemap generated!");
console.log(`Total URLs: ${routes.length}`);

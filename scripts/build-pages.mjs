#!/usr/bin/env node
// Builds the static, indexable pages from the listing data in index.html.
//
//   node scripts/build-pages.mjs            (build date = today in Sydney)
//   BUILD_DATE=2026-11-17 node scripts/build-pages.mjs
//
// index.html stays the single source of truth: edit the `D` array there, then run this.
// Output (all regenerated every run, never edit by hand):
//   grants/  hackathons/  accelerators/  guides/  sitemap.xml  robots.txt  llms.txt
// Guide content lives in scripts/guides.mjs.

import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";
import { GUIDES } from "./guides.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SITE = "https://grantsandhacks.com";
const BUILD_DATE = process.env.BUILD_DATE ||
  new Intl.DateTimeFormat("en-CA", { timeZone: "Australia/Sydney" }).format(new Date());

// ---------- read data from index.html ----------
const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
const a = html.indexOf("const UI = {"), b = html.indexOf("\nlet lang=");
if (a < 0 || b < 0) throw new Error("Could not find the UI / D blocks in index.html");
const ctx = {};
vm.createContext(ctx);
vm.runInContext(html.slice(a, b) + "\n;this.__D=D;this.__UI=UI;", ctx);
const D = ctx.__D, UI = ctx.__UI;

// ---------- helpers ----------
const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const TBA = "TBA";
const en = v => v == null ? "" : Array.isArray(v) ? v[1] : v === TBA ? "Not announced" : v;
const zh = v => v == null ? "" : Array.isArray(v) ? v[0] : v === TBA ? "未公布" : v;
const slugify = s => s.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "")
  .replace(/&/g, " and ").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);
const fmtDate = s => {
  if (!s) return "";
  const d = new Date(s + "T00:00:00Z");
  return d.toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
};
const clip = (s, n) => s.length <= n ? s : s.slice(0, s.lastIndexOf(" ", n - 1)) + "…";
const host = u => { try { return new URL(u).hostname.replace(/^www\./, ""); } catch { return ""; } };
const OFFICIAL_HINT = /(\.gov\.au|\.gov|csiro\.au|\.edu\.au)$/;

function status(x) {
  if (x.past) return "past";
  if (x.status) return x.status;
  const end = x.dlDate || x.e || x.s;
  if (end && end < BUILD_DATE) return "past";
  const ref = x.dlDate || x.s;
  if (ref) { const days = (Date.parse(ref) - Date.parse(BUILD_DATE)) / 864e5; if (days <= 10) return x.dlDate ? "closing" : "soon"; }
  return "open";
}
const ST_EN = { open: "Open", soon: "Starting within 10 days", closing: "Closing soon", tbc: "To be confirmed / rolling", past: "Past edition" };
const ST_ZH = { open: "可报名", soon: "10 天内开始", closing: "即将截止", tbc: "待确认 / 滚动", past: "往届参考" };
const ST_CLS = { open: "s-open", soon: "s-soon", closing: "s-soon", tbc: "s-tbc", past: "s-past" };
const AUS = ["syd", "mel", "bne", "cbr", "per", "adl", "au"];
const placeEn = x => x.city ? en(x.city) : UI.en.cities[x.c];
const placeZh = x => x.city ? zh(x.city) : UI.zh.cities[x.c];
const FMT_EN = UI.en.fmt, FMT_ZH = UI.zh.fmt;

const SECTIONS = {
  fund: { dir: "grants", title: "Startup grants", titleZh: "创业资助 / 补贴", kind: "Grant",
    lead: "Equity-free grants, tax incentives and government programs for startups, Australia first. Each page lists the amount, who can apply, the deadline and the official source.",
    leadZh: "不占股的政府资助、税收优惠和补贴项目，澳洲优先。每页写明金额、申请条件、截止日期和官方来源。" },
  hack: { dir: "hackathons", title: "Hackathons", titleZh: "黑客松", kind: "Hackathon",
    lead: "Hackathons in Australia and online: theme, location, dates, registration, prizes and eligibility, with a link to the organiser's page.",
    leadZh: "澳洲及线上黑客松：主题、地点、日期、报名方式、奖金和参赛资格，并附主办方官方链接。" },
  inc: { dir: "accelerators", title: "Incubators & accelerators", titleZh: "孵化器 / 加速器", kind: "Accelerator",
    lead: "Incubator and accelerator intakes: application deadlines, what they invest or charge, focus areas and eligibility.",
    leadZh: "孵化器和加速器招募：申请截止日、投资条款或费用、方向和申请条件。" },
};

// stable, unique slugs
const used = new Set();
for (const x of D) {
  let s = slugify(en(x.n)) || "item", i = 2;
  while (used.has(x.t + "/" + s)) s = slugify(en(x.n)) + "-" + i++;
  used.add(x.t + "/" + s);
  x.slug = s;
  x.st = status(x);
  x.url = `${SITE}/${SECTIONS[x.t].dir}/${s}/`;
}
const sortItems = arr => arr.slice().sort((p, q) =>
  (p.st === "past") - (q.st === "past") ||
  (AUS.includes(q.c)) - (AUS.includes(p.c)) ||
  ((p.dlDate || p.s || "9999") < (q.dlDate || q.s || "9999") ? -1 : 1));

// ---------- page shell ----------
function page({ title, description, canonical, body, jsonld, crumbs }) {
  const crumbLd = crumbs && {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c[0], item: c[1] })),
  };
  const lds = [jsonld, crumbLd].flat().filter(Boolean)
    .map(o => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, "\\u003c")}</script>`).join("\n");
  const crumbHtml = crumbs ? `<nav class="crumbs" aria-label="Breadcrumb">${crumbs.map((c, i) =>
    i < crumbs.length - 1 ? `<a href="${esc(c[1].replace(SITE, "") || "/")}">${esc(c[0])}</a>` : `<span aria-current="page">${esc(c[0])}</span>`).join(" / ")}</nav>` : "";
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${esc(canonical)}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Grants and Hacks">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${esc(canonical)}">
<meta name="robots" content="index, follow, max-snippet:-1">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;700;900&family=JetBrains+Mono:wght@500&display=swap">
<link rel="stylesheet" href="/assets/pages.css">
${lds}
</head>
<body>
<header class="wrap top-bar">
  <a class="logo" href="/">grantsandhacks.com</a>
  <nav class="site-nav" aria-label="Sections">
    <a href="/grants/">Grants</a><a href="/hackathons/">Hackathons</a><a href="/accelerators/">Accelerators</a><a href="/guides/">Guides</a>
  </nav>
</header>
<main class="wrap">
${crumbHtml}
${body}
</main>
<footer class="wrap">
  <p>Page updated ${esc(fmtDate(BUILD_DATE))}. Listings are refreshed every Monday. Details change often: always confirm amounts, eligibility and dates on the official source before you apply.</p>
  <p>本页更新于 ${esc(BUILD_DATE)}，每周一刷新。申请前请务必以主办方或政府官网为准。</p>
  <p><a href="/">Interactive list (5 languages)</a> · <a href="/grants/">Grants</a> · <a href="/hackathons/">Hackathons</a> · <a href="/accelerators/">Accelerators</a> · <a href="/guides/">Guides</a></p>
</footer>
</body>
</html>
`;
}

// ---------- item pages ----------
function factRows(x, L, labels) {
  const rows = [];
  const add = (k, v) => { if (v) rows.push(`<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`); };
  const dateTxt = x.t === "hack"
    ? (x.s ? fmtDate(x.s) + (x.e && x.e !== x.s ? " – " + fmtDate(x.e) : "") : "")
    : (x.dlDate ? fmtDate(x.dlDate) : "");
  add(labels.status, labels.st[x.st]);
  if (x.t === "hack") add(labels.dates, dateTxt);
  else add(labels.deadline, dateTxt || L(x.dl));
  if (x.t === "hack") add(labels.reg, L(x.dl));
  else if (dateTxt) add(labels.round, L(x.dl));
  add(labels.where, (labels === LBL_EN ? placeEn(x) : placeZh(x)) + " · " + (labels === LBL_EN ? FMT_EN : FMT_ZH)[x.fmt]);
  add(labels.org, L(x.org));
  add(labels.focus, L(x.focus));
  add(x.t === "hack" ? labels.prize : x.t === "fund" ? labels.amount : labels.terms, L(x.prize));
  add(labels.elig, L(x.elig));
  add(labels.fee, L(x.fee));
  add(labels.prog, L(x.prog));
  add(labels.note, L(x.note));
  return `<dl class="facts">${rows.join("")}</dl>`;
}
const LBL_EN = { status: "Status", dates: "Dates", deadline: "Deadline", round: "Round details", reg: "Registration",
  where: "Location", org: "Organiser / funder", focus: "Theme / focus", prize: "Prizes", amount: "Amount",
  terms: "Investment / terms", elig: "Who can apply", fee: "Cost", prog: "Program", note: "Note", st: ST_EN };
const LBL_ZH = { status: "状态", dates: "日期", deadline: "截止日期", round: "轮次说明", reg: "报名",
  where: "地点", org: "主办 / 出资方", focus: "主题 / 方向", prize: "奖金", amount: "金额",
  terms: "投资 / 条款", elig: "申请条件", fee: "费用", prog: "项目内容", note: "备注", st: ST_ZH };

function itemSummary(x) {
  const parts = [];
  if (x.t === "hack") {
    parts.push(`${en(x.n)} is a ${FMT_EN[x.fmt].toLowerCase()} hackathon` + (placeEn(x) ? ` (${placeEn(x)})` : "") +
      (x.s ? ` on ${fmtDate(x.s)}${x.e && x.e !== x.s ? " to " + fmtDate(x.e) : ""}` : "") + `, run by ${en(x.org)}.`);
    if (en(x.focus)) parts.push(`Theme: ${en(x.focus)}.`);
    if (x.prize && x.prize !== TBA) parts.push(`Prizes: ${en(x.prize)}.`);
  } else {
    parts.push(`${en(x.n)} is ${x.t === "fund" ? "a grant / funding program" : "an incubator or accelerator program"} from ${en(x.org)}` +
      `. Area: ${placeEn(x)}.`);
    if (x.prize && x.prize !== TBA) parts.push(`${x.t === "fund" ? "Amount" : "Terms"}: ${en(x.prize)}.`);
    if (x.dlDate) parts.push(`Deadline: ${fmtDate(x.dlDate)}.`);
  }
  if (x.elig) parts.push(`Who can apply: ${en(x.elig)}.`);
  return parts.join(" ").replace(/\.\./g, ".");
}

function itemJsonLd(x) {
  const desc = itemSummary(x);
  const org = { "@type": "Organization", name: en(x.org) };
  if (x.t === "hack") {
    const mode = { off: "OfflineEventAttendanceMode", on: "OnlineEventAttendanceMode", hyb: "MixedEventAttendanceMode" }[x.fmt] || "OfflineEventAttendanceMode";
    const country = AUS.includes(x.c) ? "AU" : undefined;
    const physical = { "@type": "Place", name: placeEn(x), address: { "@type": "PostalAddress", addressLocality: placeEn(x), ...(country && { addressCountry: country }) } };
    const virtual = { "@type": "VirtualLocation", url: x.u };
    return { "@context": "https://schema.org", "@type": "Event", name: en(x.n), description: desc,
      ...(x.s && { startDate: x.s }), ...((x.e || x.s) && { endDate: x.e || x.s }),
      eventStatus: "https://schema.org/EventScheduled", eventAttendanceMode: "https://schema.org/" + mode,
      location: x.fmt === "on" ? virtual : x.fmt === "hyb" ? [physical, virtual] : physical,
      organizer: { ...org, url: x.u }, url: x.url, sameAs: x.u,
      ...(x.fee && /free/i.test(en(x.fee)) && { isAccessibleForFree: true }) };
  }
  if (x.t === "fund") {
    return { "@context": "https://schema.org", "@type": "MonetaryGrant", name: en(x.n), description: desc,
      funder: org, url: x.url, sameAs: x.src || x.u, areaServed: placeEn(x) };
  }
  return { "@context": "https://schema.org", "@type": "EducationalOccupationalProgram", name: en(x.n), description: desc,
    provider: org, url: x.url, sameAs: x.u, ...(x.dlDate && { applicationDeadline: x.dlDate }),
    ...(x.s && { startDate: x.s }), educationalProgramMode: FMT_EN[x.fmt] };
}

function itemPage(x) {
  const sec = SECTIONS[x.t];
  const name = en(x.n), nameZh = zh(x.n);
  const official = x.src || x.u;
  const isOfficial = OFFICIAL_HINT.test(host(official)) || !!x.src;
  const yr = (x.s || x.dlDate || "").slice(0, 4);
  const title = `${name}${x.t !== "hack" || !yr || /20\d\d/.test(name) ? "" : " " + yr}: ${x.t === "hack" ? "dates, prizes, eligibility" : x.t === "fund" ? "amount, eligibility, deadline" : "deadline, terms, eligibility"} | Grants and Hacks`;
  const body = `
<article>
  <p class="kicker">${esc(sec.kind)} · <span class="status ${ST_CLS[x.st]}">${esc(ST_EN[x.st])}</span></p>
  <h1>${esc(name)}</h1>
  ${nameZh && nameZh !== name ? `<p class="alt-name" lang="zh-CN">${esc(nameZh)}</p>` : ""}
  <p class="summary">${esc(itemSummary(x))}</p>
  <h2>Key facts</h2>
  ${factRows(x, en, LBL_EN)}
  <p class="source">Official source: <a href="${esc(official)}" rel="noopener">${esc(host(official))}</a>${isOfficial ? "" : ` <span class="warn">(organiser or directory page; check the program's own site)</span>`}</p>
  <section lang="zh-CN" class="zh">
    <h2>中文信息</h2>
    ${factRows(x, zh, LBL_ZH)}
  </section>
  <p class="back"><a href="/${sec.dir}/">← All ${esc(sec.title.toLowerCase())}</a></p>
</article>`;
  return page({
    title, description: clip(itemSummary(x), 300), canonical: x.url, body, jsonld: itemJsonLd(x),
    crumbs: [["Home", SITE + "/"], [sec.title, `${SITE}/${sec.dir}/`], [name, x.url]],
  });
}

// ---------- section index pages ----------
function card(x) {
  const date = x.t === "hack" ? (x.s ? fmtDate(x.s) : "Date TBA") : (x.dlDate ? "Closes " + fmtDate(x.dlDate) : en(x.dl));
  return `<li class="card"><a href="/${SECTIONS[x.t].dir}/${x.slug}/"><strong>${esc(en(x.n))}</strong></a>
  <span class="status ${ST_CLS[x.st]}">${esc(ST_EN[x.st])}</span>
  <span class="line">${esc(placeEn(x))} · ${esc(date)}</span>
  ${x.prize && x.prize !== TBA ? `<span class="line">${esc(en(x.prize))}</span>` : ""}</li>`;
}
function sectionPage(t) {
  const sec = SECTIONS[t];
  const items = sortItems(D.filter(x => x.t === t));
  const cur = items.filter(x => x.st !== "past"), past = items.filter(x => x.st === "past");
  const groups = [
    ["Australia", cur.filter(x => AUS.includes(x.c))],
    ["Online", cur.filter(x => x.c === "online")],
    ["Global / overseas", cur.filter(x => x.c === "global")],
    ["China", cur.filter(x => x.c === "cn")],
    ["Past editions (for planning next year)", past],
  ].filter(g => g[1].length);
  const yrs = [...new Set(items.map(x => (x.s || x.dlDate || "").slice(0, 4)).filter(Boolean))].sort();
  const yrTxt = yrs.length ? ` (${yrs[0]}${yrs.length > 1 ? "–" + yrs[yrs.length - 1] : ""})` : "";
  const canonical = `${SITE}/${sec.dir}/`;
  const body = `
<h1>${esc(sec.title)} in Australia and online${esc(yrTxt)}</h1>
<p class="summary">${esc(sec.lead)}</p>
<p class="alt-name" lang="zh-CN">${esc(sec.titleZh)}：${esc(sec.leadZh)}</p>
<p class="meta-line">${cur.length} current · ${past.length} past · updated ${esc(fmtDate(BUILD_DATE))}</p>
${groups.map(([h, arr]) => `<h2>${esc(h)}</h2><ul class="cards">${arr.map(card).join("")}</ul>`).join("\n")}
${t === "fund" ? `<p class="back">New to grants? Read <a href="/guides/can-a-sole-trader-get-startup-grants-australia/">Can an Australian sole trader get startup grants?</a></p>` : ""}
${t === "hack" ? `<p class="back">Preparing for one? Read <a href="/guides/how-to-prepare-a-hackathon-project/">How to prepare a hackathon project</a></p>` : ""}`;
  return page({
    title: `${sec.title} in Australia${yrTxt}: open now and upcoming | Grants and Hacks`,
    description: sec.lead, canonical, body,
    jsonld: { "@context": "https://schema.org", "@type": "CollectionPage", name: sec.title, url: canonical, dateModified: BUILD_DATE,
      mainEntity: { "@type": "ItemList", itemListElement: items.map((x, i) => ({ "@type": "ListItem", position: i + 1, url: x.url, name: en(x.n) })) } },
    crumbs: [["Home", SITE + "/"], [sec.title, canonical]],
  });
}

// ---------- guides ----------
function guidePage(g) {
  const url = `${SITE}/guides/${g.slug}/`;
  const faq = g.faq?.length ? {
    "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: g.faq.map(([q, aTxt]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: aTxt } })),
  } : null;
  const article = { "@context": "https://schema.org", "@type": "Article", headline: g.title, description: g.description,
    datePublished: g.published, dateModified: g.reviewed, inLanguage: "en", url,
    author: { "@type": "Organization", name: "Grants and Hacks", url: SITE + "/" },
    publisher: { "@type": "Organization", name: "Grants and Hacks", url: SITE + "/" },
    citation: g.sources.map(s => s[1]) };
  const body = `
<article class="guide">
  <p class="kicker">Guide · reviewed ${esc(fmtDate(g.reviewed))}</p>
  <h1>${esc(g.title)}</h1>
  <p class="alt-name" lang="zh-CN">${esc(g.titleZh)}</p>
  <div class="answer"><strong>Short answer:</strong> ${g.answer}</div>
  <div class="answer zh" lang="zh-CN"><strong>简要回答：</strong>${g.answerZh}</div>
  ${g.body}
  ${g.faq?.length ? `<h2>Common questions</h2>${g.faq.map(([q, aTxt]) => `<h3>${esc(q)}</h3><p>${esc(aTxt)}</p>`).join("")}` : ""}
  <h2>Official sources</h2>
  <ol class="sources">${g.sources.map(([t, u]) => `<li><a href="${esc(u)}" rel="noopener">${esc(t)}</a> <span class="host">${esc(host(u))}</span></li>`).join("")}</ol>
  <p class="disclaimer">General information, not legal, tax or financial advice. Program rules change; check the official source before you apply. Last checked against the sources above on ${esc(fmtDate(g.reviewed))}.</p>
</article>`;
  return page({ title: g.title + " | Grants and Hacks", description: g.description, canonical: url, body,
    jsonld: [article, faq], crumbs: [["Home", SITE + "/"], ["Guides", SITE + "/guides/"], [g.short || g.title, url]] });
}
function guidesIndex() {
  const canonical = SITE + "/guides/";
  const body = `
<h1>Startup guides</h1>
<p class="summary">Plain answers to common questions from early-stage founders in Australia, each checked against official sources.</p>
<p class="alt-name" lang="zh-CN">创业指南：用简单的话回答早期创业者的常见问题，每篇都对照官方来源核实。</p>
<ul class="cards">${GUIDES.map(g => `<li class="card"><a href="/guides/${g.slug}/"><strong>${esc(g.title)}</strong></a><span class="line">${esc(g.description)}</span><span class="line" lang="zh-CN">${esc(g.titleZh)}</span></li>`).join("")}</ul>`;
  return page({ title: "Startup guides for Australian founders | Grants and Hacks",
    description: "Plain answers on startup grants, sole traders and hackathons for Australian founders, with official sources.",
    canonical, body,
    jsonld: { "@context": "https://schema.org", "@type": "CollectionPage", name: "Startup guides", url: canonical, dateModified: BUILD_DATE },
    crumbs: [["Home", SITE + "/"], ["Guides", canonical]] });
}

// ---------- write everything ----------
const write = (rel, content) => {
  const f = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, content);
};
for (const d of ["grants", "hackathons", "accelerators", "guides"]) fs.rmSync(path.join(ROOT, d), { recursive: true, force: true });

const urls = [[SITE + "/", BUILD_DATE, "1.0"]];
for (const t of Object.keys(SECTIONS)) {
  write(`${SECTIONS[t].dir}/index.html`, sectionPage(t));
  urls.push([`${SITE}/${SECTIONS[t].dir}/`, BUILD_DATE, "0.9"]);
}
for (const x of D) {
  write(`${SECTIONS[x.t].dir}/${x.slug}/index.html`, itemPage(x));
  urls.push([x.url, BUILD_DATE, x.st === "past" ? "0.4" : "0.7"]);
}
write("guides/index.html", guidesIndex());
urls.push([SITE + "/guides/", BUILD_DATE, "0.8"]);
for (const g of GUIDES) {
  write(`guides/${g.slug}/index.html`, guidePage(g));
  urls.push([`${SITE}/guides/${g.slug}/`, g.reviewed, "0.8"]);
}

write("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(([u, d, p]) => `  <url><loc>${esc(u)}</loc><lastmod>${d}</lastmod><priority>${p}</priority></url>`).join("\n")}
</urlset>
`);

write("robots.txt", `# Search engines and AI assistants are welcome to read and cite this site.
User-agent: *
Allow: /

Sitemap: ${SITE}/sitemap.xml
`);

// llms.txt: a plain-text map of the site for AI crawlers (https://llmstxt.org)
const cur = t => sortItems(D.filter(x => x.t === t && x.st !== "past"));
write("llms.txt", `# Grants and Hacks

> Hackathons, incubator / accelerator intakes and equity-free startup grants, Australia first, plus major global programs. Updated every Monday. Every listing links to its official source; confirm details there before applying.

Last updated: ${BUILD_DATE}

## Sections
- [Startup grants](${SITE}/grants/): amount, eligibility, deadline, official source
- [Hackathons](${SITE}/hackathons/): theme, location, dates, registration, prizes, eligibility
- [Incubators & accelerators](${SITE}/accelerators/): deadlines, terms, eligibility
- [Guides](${SITE}/guides/): plain answers for early-stage founders

## Guides
${GUIDES.map(g => `- [${g.title}](${SITE}/guides/${g.slug}/): ${g.description}`).join("\n")}

## Current grants
${cur("fund").map(x => `- [${en(x.n)}](${x.url}): ${en(x.prize)}`).join("\n")}

## Current hackathons
${cur("hack").map(x => `- [${en(x.n)}](${x.url}): ${placeEn(x)}, ${x.s ? fmtDate(x.s) : "date TBA"}`).join("\n")}

## Current incubators & accelerators
${cur("inc").map(x => `- [${en(x.n)}](${x.url}): ${placeEn(x)}`).join("\n")}
`);

console.log(`Built ${D.length} listing pages, ${GUIDES.length} guides, ${urls.length} sitemap URLs (build date ${BUILD_DATE}).`);

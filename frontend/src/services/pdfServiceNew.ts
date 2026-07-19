/**
 * pdfService.ts
 * ---------------------------------------------------------------------------
 * InsightForge AI — Enterprise Business Intelligence PDF Report Generator
 * ---------------------------------------------------------------------------
 * Produces a polished, multi-page PDF report (Power BI / Tableau style)
 * from the existing report object returned by the backend.
 *
 * IMPORTANT:
 *  - No backend / API changes required.
 *  - No changes to the shape of the `report` object.
 *  - Pure frontend rendering layer built on top of jsPDF.
 *
 * Pages:
 *   1) Cover / Branding + Executive Summary + KPI Cards
 *   2) Business Analysis (Key Statistics, Business Insights, Dataset Quality)
 *   3) Recommendations + Conclusion
 *   (Additional pages are created automatically if content overflows.)
 * ---------------------------------------------------------------------------
 */

import { jsPDF } from "jspdf";

/* ============================================================================
 * 1. TYPES — matches the existing report object, kept intentionally flexible
 *    so we never have to touch the backend contract.
 * ==========================================================================*/

export interface DatasetQualityInfo {
  rows?: number;
  row_count?: number;
  total_rows?: number;
  columns?: number;
  column_count?: number;
  total_columns?: number;
  memory_usage?: string | number;
  memory?: string | number;
  missing_values?: number;
  missing_count?: number;
  duplicate_rows?: number;
  duplicates?: number;
  quality_score?: number;
  score?: number;
  status?: string;
  summary?: string;
  [key: string]: unknown;
}

export interface KeyStatisticEntry {
  label?: string;
  name?: string;
  key?: string;
  value?: string | number;
  val?: string | number;
  unit?: string;
  [key: string]: unknown;
}

export type KeyStatistics = KeyStatisticEntry[] | Record<string, unknown>;

export interface BusinessInsightEntry {
  title?: string;
  heading?: string;
  description?: string;
  detail?: string;
  text?: string;
  content?: string;
  icon?: string;
  category?: string;
  [key: string]: unknown;
}

export type BusinessInsights = (BusinessInsightEntry | string)[];

export interface RecommendationEntry {
  title?: string;
  heading?: string;
  description?: string;
  detail?: string;
  text?: string;
  content?: string;
  priority?: "high" | "medium" | "low" | string;
  [key: string]: unknown;
}

export type Recommendations = (RecommendationEntry | string)[];

interface ReportData {
    title: string;
    generated_at: string;
    dataset_name: string;

    executive_summary: string;

    dataset_quality: {
        rows: number;
        columns: number;
        memory: number;
        missing_values: number;
        duplicate_rows: number;
        quality_score: number;
        status: string;
    };

    key_statistics: Record<string, unknown>;

    business_insights: any[];

    recommendations: any[];

    conclusion: string;
}

/* ============================================================================
 * 2. THEME — corporate blue / purple palette
 * ==========================================================================*/

type RGB = [number, number, number];

const THEME = {
  colors: {
    deepBlue: [17, 39, 92] as RGB,
    primaryBlue: [37, 99, 235] as RGB,
    purple: [124, 58, 237] as RGB,
    lightPurple: [237, 233, 254] as RGB,
    lightBlue: [219, 234, 254] as RGB,
    grayBg: [246, 247, 250] as RGB,
    grayBorder: [223, 227, 235] as RGB,
    textDark: [23, 28, 40] as RGB,
    textMedium: [100, 108, 124] as RGB,
    textLight: [148, 156, 173] as RGB,
    white: [255, 255, 255] as RGB,
    success: [16, 163, 116] as RGB,
    warning: [217, 130, 15] as RGB,
    danger: [220, 58, 58] as RGB,
  },
  fonts: {
    family: "helvetica",
  },
};

/* ============================================================================
 * 3. RENDER CONTEXT — shared mutable state passed between draw helpers
 * ==========================================================================*/

interface PdfContext {
  doc: jsPDF;
  pageWidth: number;
  pageHeight: number;
  margin: number;
  contentWidth: number;
  y: number;
  currentSection: string;
}

function createContext(doc: jsPDF): PdfContext {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  return {
    doc,
    pageWidth,
    pageHeight,
    margin,
    contentWidth: pageWidth - margin * 2,
    y: margin,
    currentSection: "",
  };
}

/* ============================================================================
 * 4. GENERIC HELPERS
 * ==========================================================================*/

function setFill(doc: jsPDF, c: RGB) {
  doc.setFillColor(c[0], c[1], c[2]);
}
function setText(doc: jsPDF, c: RGB) {
  doc.setTextColor(c[0], c[1], c[2]);
}
function setDraw(doc: jsPDF, c: RGB) {
  doc.setDrawColor(c[0], c[1], c[2]);
}

/** Linear interpolation between two RGB colors (used for gradient banners) */
function lerpColor(a: RGB, b: RGB, t: number): RGB {
  return [
    Math.round(a[0] + (b[0] - a[0]) * t),
    Math.round(a[1] + (b[1] - a[1]) * t),
    Math.round(a[2] + (b[2] - a[2]) * t),
  ];
}

/** Draws a smooth horizontal gradient rectangle using thin vertical slices */
function drawGradientRect(
  doc: jsPDF,
  x: number,
  y: number,
  w: number,
  h: number,
  from: RGB,
  to: RGB
) {
  const steps = 60;
  const sliceWidth = w / steps;
  for (let i = 0; i < steps; i++) {
    const t = i / (steps - 1);
    const color = lerpColor(from, to, t);
    setFill(doc, color);
    doc.rect(x + i * sliceWidth, y, sliceWidth + 0.5, h, "F");
  }
}

/** Safely converts any value to a display string */
function toDisplay(value: unknown, fallback = "N/A"): string {
  if (value === null || value === undefined || value === "") return fallback;
  if (typeof value === "number") return value.toLocaleString();
  return String(value);
}

/** Formats a numeric quality score (0-100 or 0-1) into a percentage string */
function formatScore(value: unknown): string {
  if (typeof value !== "number") return toDisplay(value);
  const pct = value <= 1 ? value * 100 : value;
  return `${pct.toFixed(1)}%`;
}

/** Picks the first defined value among several possible keys on an object */
function pick(obj: Record<string, unknown> | undefined, keys: string[]): unknown {
  if (!obj) return undefined;
  for (const k of keys) {
    if (obj[k] !== undefined && obj[k] !== null && obj[k] !== "") return obj[k];
  }
  return undefined;
}

/** Formats an ISO date string into a readable long-form date */
function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateStr;
  }
}

function sanitizeFilename(name: string): string {
  return name.replace(/[^a-z0-9\-_]+/gi, "_").slice(0, 60) || "InsightForge_Report";
}

/* ============================================================================
 * 5. PAGE-LEVEL HELPERS — header, footer, page breaks
 * ==========================================================================*/

/** Draws the large branded hero header used on the cover page (Page 1) */
function drawHeroHeader(ctx: PdfContext, report: ReportData): void {
  const { doc, pageWidth } = ctx;
  const headerHeight = 62;

  drawGradientRect(
    doc,
    0,
    0,
    pageWidth,
    headerHeight,
    THEME.colors.deepBlue,
    THEME.colors.purple
  );

  // Brand mark
  setFill(doc, THEME.colors.white);
  doc.roundedRect(ctx.margin, 14, 12, 12, 3, 3, "F");
  setText(doc, THEME.colors.purple);
  doc.setFont(THEME.fonts.family, "bold");
  doc.setFontSize(14);
  doc.text("IF", ctx.margin + 6, 22.5, { align: "center" });

  // Brand name
  setText(doc, THEME.colors.white);
  doc.setFont(THEME.fonts.family, "bold");
  doc.setFontSize(15);
  doc.text("InsightForge AI", ctx.margin + 17, 22.5);

  doc.setFont(THEME.fonts.family, "normal");
  doc.setFontSize(9);
  setText(doc, THEME.colors.lightBlue);
  doc.text("Automated Business Intelligence Report", ctx.margin + 17, 27.5);

  // Report title
  setText(doc, THEME.colors.white);
  doc.setFont(THEME.fonts.family, "bold");
  doc.setFontSize(22);
  const titleLines = doc.splitTextToSize(report.title || "Business Intelligence Report", ctx.contentWidth);
  doc.text(titleLines, ctx.margin, 42);

  // Meta row: dataset name + generated date
  doc.setFont(THEME.fonts.family, "normal");
  doc.setFontSize(10);
  setText(doc, THEME.colors.lightBlue);
  const metaY = 42 + titleLines.length * 7 + 4;
  doc.text(`Dataset: ${toDisplay(report.dataset_name)}`, ctx.margin, Math.min(metaY, headerHeight - 8));
  doc.text(
    `Generated: ${formatDate(report.generated_at)}`,
    pageWidth - ctx.margin,
    Math.min(metaY, headerHeight - 8),
    { align: "right" }
  );

  ctx.y = headerHeight + 12;
}

/** Draws the slim section header used on Page 2, Page 3, and continuation pages */
function drawPageHeader(ctx: PdfContext, sectionTitle: string): void {
  const { doc, pageWidth } = ctx;
  const headerHeight = 24;

  drawGradientRect(
    doc,
    0,
    0,
    pageWidth,
    headerHeight,
    THEME.colors.deepBlue,
    THEME.colors.purple
  );

  setText(doc, THEME.colors.white);
  doc.setFont(THEME.fonts.family, "bold");
  doc.setFontSize(13);
  doc.text("InsightForge AI", ctx.margin, 14);

  doc.setFont(THEME.fonts.family, "normal");
  doc.setFontSize(11);
  doc.text(sectionTitle, pageWidth - ctx.margin, 14, { align: "right" });

  ctx.currentSection = sectionTitle;
  ctx.y = headerHeight + 10;
}

/**
 * Ensures there is enough vertical space left on the page for the next block.
 * If not, adds a new page, redraws the slim section header (marked "cont'd"),
 * and resets ctx.y accordingly.
 */
function addPageIfNeeded(ctx: PdfContext, requiredHeight: number): void {
  const bottomLimit = ctx.pageHeight - 22; // reserve space for footer
  if (ctx.y + requiredHeight > bottomLimit) {
    ctx.doc.addPage();
    drawPageHeader(ctx, ctx.currentSection ? `${ctx.currentSection} (cont'd)` : "Report");
  }
}

/** Draws a section title with an accent underline */
function drawSectionTitle(ctx: PdfContext, text: string): void {
  addPageIfNeeded(ctx, 16);
  const { doc } = ctx;

  setText(doc, THEME.colors.textDark);
  doc.setFont(THEME.fonts.family, "bold");
  doc.setFontSize(14);
  doc.text(text, ctx.margin, ctx.y);

  setDraw(doc, THEME.colors.purple);
  doc.setLineWidth(1.2);
  doc.line(ctx.margin, ctx.y + 2.5, ctx.margin + 22, ctx.y + 2.5);

  ctx.y += 10;
}

/** Draws a thin horizontal separator across the content width */
function drawSeparator(ctx: PdfContext): void {
  const { doc } = ctx;
  setDraw(doc, THEME.colors.grayBorder);
  doc.setLineWidth(0.3);
  doc.line(ctx.margin, ctx.y, ctx.pageWidth - ctx.margin, ctx.y);
  ctx.y += 6;
}

/** Draws the footer (page number + brand credit) on the CURRENT page only */
function drawFooter(doc: jsPDF, pageNumber: number, totalPages: number, pageWidth: number, pageHeight: number, margin: number): void {
  setDraw(doc, THEME.colors.grayBorder);
  doc.setLineWidth(0.3);
  doc.line(margin, pageHeight - 14, pageWidth - margin, pageHeight - 14);

  doc.setFont(THEME.fonts.family, "normal");
  doc.setFontSize(8.5);
  setText(doc, THEME.colors.textLight);

  doc.text("Generated by InsightForge AI", margin, pageHeight - 8);
  doc.text(
    `Page ${pageNumber} of ${totalPages}`,
    pageWidth - margin,
    pageHeight - 8,
    { align: "right" }
  );
  doc.text(
    "Confidential — For internal business use only",
    pageWidth / 2,
    pageHeight - 8,
    { align: "center" }
  );
}

/** After all content is drawn, loops through every page and stamps the footer */
function finalizeFootersAndPageNumbers(doc: jsPDF, pageWidth: number, pageHeight: number, margin: number): void {
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    drawFooter(doc, i, totalPages, pageWidth, pageHeight, margin);
  }
}

/* ============================================================================
 * 6. CARD COMPONENTS
 * ==========================================================================*/

/** A single KPI card (used in the 3x2 grid on Page 1) */
function drawKpiCard(
  ctx: PdfContext,
  x: number,
  y: number,
  w: number,
  h: number,
  label: string,
  value: string,
  accent: RGB
): void {
  const { doc } = ctx;

  // Card background
  setFill(doc, THEME.colors.white);
  setDraw(doc, THEME.colors.grayBorder);
  doc.setLineWidth(0.4);
  doc.roundedRect(x, y, w, h, 3, 3, "FD");

  // Accent bar on the left edge
  setFill(doc, accent);
  doc.roundedRect(x, y, 2.5, h, 1.2, 1.2, "F");

  // Value
  setText(doc, THEME.colors.textDark);
  doc.setFont(THEME.fonts.family, "bold");
  doc.setFontSize(16);
  doc.text(value, x + w / 2, y + h / 2 - 1, { align: "center" });

  // Label
  doc.setFont(THEME.fonts.family, "normal");
  doc.setFontSize(8.5);
  setText(doc, THEME.colors.textMedium);
  doc.text(label.toUpperCase(), x + w / 2, y + h / 2 + 7, { align: "center" });
}

/** Renders the full KPI grid (Rows, Columns, Memory, Missing, Duplicates, Quality Score) */
function drawKpiSection(ctx: PdfContext, report: ReportData): void {

    const quality = report.dataset_quality;

    const kpis = [
        {
            label: "Rows",
            value: String(quality.rows),
            accent: THEME.colors.primaryBlue,
        },
        {
            label: "Columns",
            value: String(quality.columns),
            accent: THEME.colors.purple,
        },
        {
            label: "Memory",
            value: `${quality.memory} MB`,
            accent: THEME.colors.primaryBlue,
        },
        {
            label: "Missing",
            value: String(quality.missing_values),
            accent: THEME.colors.warning,
        },
        {
            label: "Duplicates",
            value: String(quality.duplicate_rows),
            accent: THEME.colors.danger,
        },
        {
            label: "Quality",
            value: `${quality.quality_score}%`,
            accent: THEME.colors.success,
        },
    ];

    drawSectionTitle(ctx, "Dataset Overview");

    const cols = 3;
    const gap = 5;
    const cardW = (ctx.contentWidth - gap * (cols - 1)) / cols;
    const cardH = 26;

    kpis.forEach((kpi, i) => {

        const col = i % cols;
        const row = Math.floor(i / cols);

        drawKpiCard(
            ctx,
            ctx.margin + col * (cardW + gap),
            ctx.y + row * (cardH + gap),
            cardW,
            cardH,
            kpi.label,
            kpi.value,
            kpi.accent
        );
    });

    ctx.y += Math.ceil(kpis.length / cols) * (cardH + gap);
}

/** A bordered card for a single key statistic (label / value pair) */
function drawStatCard(ctx: PdfContext, x: number, y: number, w: number, h: number, label: string, value: string): void {
  const { doc } = ctx;
  setFill(doc, THEME.colors.grayBg);
  setDraw(doc, THEME.colors.grayBorder);
  doc.setLineWidth(0.3);
  doc.roundedRect(x, y, w, h, 2.5, 2.5, "FD");

  doc.setFont(THEME.fonts.family, "normal");
  doc.setFontSize(8.5);
  setText(doc, THEME.colors.textMedium);
  const labelLines = doc.splitTextToSize(label, w - 6);
  doc.text(labelLines, x + 4, y + 7);

  doc.setFont(THEME.fonts.family, "bold");
  doc.setFontSize(11);
  setText(doc, THEME.colors.primaryBlue);
  doc.text(value, x + 4, y + h - 5);
}

/** Renders the Key Statistics section as a responsive grid of stat cards */
function drawKeyStatisticsSection(ctx: PdfContext, report: ReportData): void {
    const raw = report.key_statistics;
      let entries: { label: string; value: string }[] = [];

  if (Array.isArray(raw)) {
    entries = raw.map((item, i) => {
      if (typeof item === "object" && item !== null) {
        const label = String(pick(item as Record<string, unknown>, ["label", "name", "key"]) ?? `Metric ${i + 1}`);
        const value = pick(item as Record<string, unknown>, ["value", "val"]);
        const unit = pick(item as Record<string, unknown>, ["unit"]);
        return { label, value: `${toDisplay(value)}${unit ? " " + unit : ""}` };
      }
      return { label: `Metric ${i + 1}`, value: toDisplay(item) };
    });
  } else if (raw && typeof raw === "object") {
    entries = Object.entries(raw).map(([label, value]) => ({
      label,
      value: toDisplay(value),
    }));
  }

  if (entries.length === 0) return;

  drawSectionTitle(ctx, "Key Statistics");

  const cols = 2;
  const gap = 5;
  const cardW = (ctx.contentWidth - gap * (cols - 1)) / cols;
  const cardH = 18;

  entries.forEach((entry, i) => {
    const col = i % cols;
    if (col === 0) addPageIfNeeded(ctx, cardH + gap);
    const x = ctx.margin + col * (cardW + gap);
    const y = ctx.y;
    drawStatCard(ctx, x, y, cardW, cardH, entry.label, entry.value);
    if (col === cols - 1 || i === entries.length - 1) {
      ctx.y += cardH + gap;
    }
  });

  ctx.y += 4;
}

/** Returns an ASCII/unicode glyph to stand in for an icon based on category or index */
function iconForInsight(category?: string, index = 0): string {
  const map: Record<string, string> = {
    trend: "↗",
    growth: "↗",
    risk: "⚠",
    warning: "⚠",
    positive: "✓",
    negative: "✕",
    correlation: "⇄",
    anomaly: "✱",
    performance: "⚡",
  };
  if (category && map[category.toLowerCase()]) return map[category.toLowerCase()];
  const fallback = ["◆", "●", "▲", "★", "■"];
  return fallback[index % fallback.length];
}

/** A single highlighted insight card with an icon, title, and description */
function drawInsightCard(ctx: PdfContext, index: number, insight: BusinessInsightEntry | string): void {
  const { doc } = ctx;

  let title = "";
  let description = "";
  let icon = "";

  if (typeof insight === "string") {
    description = insight;
  } else {
    title = String(pick(insight, ["title", "heading"]) ?? "");
    description = String(pick(insight, ["description", "detail", "text", "content"]) ?? "");
    icon = String(insight.icon ?? "");
  }
  if (!icon) icon = iconForInsight(typeof insight === "string" ? undefined : insight.category, index);
  if (!title && !description) description = String(insight);

  const textWidth = ctx.contentWidth - 20;
  doc.setFont(THEME.fonts.family, "normal");
  doc.setFontSize(9.5);
  const bodyLines: string[] = doc.splitTextToSize(description, textWidth);

  const titleHeight = title ? 6 : 0;
  const bodyHeight = bodyLines.length * 4.6;
  const cardH = Math.max(16, titleHeight + bodyHeight + 10);

  addPageIfNeeded(ctx, cardH + 4);

  // Card background
  setFill(doc, THEME.colors.lightPurple);
  setDraw(doc, THEME.colors.purple);
  doc.setLineWidth(0.3);
  doc.roundedRect(ctx.margin, ctx.y, ctx.contentWidth, cardH, 2.5, 2.5, "FD");

  // Icon badge
  setFill(doc, THEME.colors.purple);
  doc.circle(ctx.margin + 8, ctx.y + cardH / 2, 4.2, "F");
  setText(doc, THEME.colors.white);
  doc.setFont(THEME.fonts.family, "bold");
  doc.setFontSize(9);
  doc.text(icon, ctx.margin + 8, ctx.y + cardH / 2 + 1.3, { align: "center" });

  // Title + body
  let textY = ctx.y + 7;
  const textX = ctx.margin + 16;
  if (title) {
    setText(doc, THEME.colors.deepBlue);
    doc.setFont(THEME.fonts.family, "bold");
    doc.setFontSize(10.5);
    doc.text(title, textX, textY);
    textY += 6;
  }
  setText(doc, THEME.colors.textDark);
  doc.setFont(THEME.fonts.family, "normal");
  doc.setFontSize(9.5);
  doc.text(bodyLines, textX, textY);

  ctx.y += cardH + 5;
}

/** Renders the full Business Insights section */
function drawBusinessInsightsSection(ctx: PdfContext, report: ReportData): void {
    const insights = report.business_insights || [];
  if (insights.length === 0) return;

  drawSectionTitle(ctx, "Business Insights");
  insights.forEach((insight, i) => drawInsightCard(ctx, i, insight));
  ctx.y += 2;
}

/** Determines a status color/label from a quality score or explicit status field */
function resolveQualityStatus(dq: DatasetQualityInfo): { label: string; color: RGB } {
  const explicit = pick(dq, ["status"]);
  if (typeof explicit === "string") {
    const lower = explicit.toLowerCase();
    if (lower.includes("good") || lower.includes("high") || lower.includes("excellent")) {
      return { label: explicit, color: THEME.colors.success };
    }
    if (lower.includes("fair") || lower.includes("medium") || lower.includes("moderate")) {
      return { label: explicit, color: THEME.colors.warning };
    }
    if (lower.includes("poor") || lower.includes("low") || lower.includes("bad")) {
      return { label: explicit, color: THEME.colors.danger };
    }
    return { label: explicit, color: THEME.colors.primaryBlue };
  }

  const scoreRaw = dq.quality_score;
  const score = typeof scoreRaw === "number" ? (scoreRaw <= 1 ? scoreRaw * 100 : scoreRaw) : undefined;
  if (score === undefined) return { label: "Not Available", color: THEME.colors.textMedium };
  if (score >= 85) return { label: "Excellent", color: THEME.colors.success };
  if (score >= 65) return { label: "Good", color: THEME.colors.primaryBlue };
  if (score >= 45) return { label: "Fair", color: THEME.colors.warning };
  return { label: "Needs Attention", color: THEME.colors.danger };
}

/** Renders the Dataset Quality status panel */
function drawDatasetQualitySection(ctx: PdfContext, report: ReportData): void {
    const dq = report.dataset_quality;
  const { doc } = ctx;

  drawSectionTitle(ctx, "Dataset Quality");

  const { label, color } = resolveQualityStatus(dq);
  const summary = `
Overall Score : ${dq.quality_score}

Quality : ${dq.status}

Missing Values : ${dq.missing_values}

Duplicate Rows : ${dq.duplicate_rows}
`;
  const bodyLines: string[] = summary
    ? doc.splitTextToSize(summary, ctx.contentWidth - 16)
    : [];

  const panelH = Math.max(22, 16 + bodyLines.length * 4.6);
  addPageIfNeeded(ctx, panelH + 4);

  // Panel background tinted with the status color
  setFill(doc, [
    Math.min(255, color[0] + (255 - color[0]) * 0.88),
    Math.min(255, color[1] + (255 - color[1]) * 0.88),
    Math.min(255, color[2] + (255 - color[2]) * 0.88),
  ] as RGB);
  setDraw(doc, color);
  doc.setLineWidth(0.4);
  doc.roundedRect(ctx.margin, ctx.y, ctx.contentWidth, panelH, 2.5, 2.5, "FD");

  // Status badge
  setFill(doc, color);
  doc.roundedRect(ctx.margin + 5, ctx.y + 5, 32, 8, 4, 4, "F");
  setText(doc, THEME.colors.white);
  doc.setFont(THEME.fonts.family, "bold");
  doc.setFontSize(8.5);
  doc.text(label.toUpperCase(), ctx.margin + 21, ctx.y + 10.2, { align: "center" });

  // Quality score, right aligned
  const scoreRaw = dq.quality_score;
  if (scoreRaw !== undefined) {
    setText(doc, THEME.colors.textDark);
    doc.setFont(THEME.fonts.family, "bold");
    doc.setFontSize(11);
    doc.text(formatScore(scoreRaw), ctx.pageWidth - ctx.margin - 5, ctx.y + 10.2, { align: "right" });
  }

  // Summary text
  if (bodyLines.length) {
    setText(doc, THEME.colors.textDark);
    doc.setFont(THEME.fonts.family, "normal");
    doc.setFontSize(9.5);
    doc.text(bodyLines, ctx.margin + 5, ctx.y + 18);
  }

  ctx.y += panelH + 6;
}

/** Determines an accent color for a recommendation priority level */
function priorityColor(priority?: string): RGB {
  if (!priority) return THEME.colors.primaryBlue;
  const p = priority.toLowerCase();
  if (p.includes("high")) return THEME.colors.danger;
  if (p.includes("medium")) return THEME.colors.warning;
  if (p.includes("low")) return THEME.colors.success;
  return THEME.colors.primaryBlue;
}

/** A single recommendation card with a numbered badge and optional priority tag */
function drawRecommendationCard(ctx: PdfContext, index: number, rec: RecommendationEntry | string): void {
  const { doc } = ctx;

  let title = "";
  let description = "";
  let priority = "";

  if (typeof rec === "string") {
    description = rec;
  } else {
    title = String(pick(rec, ["title", "heading"]) ?? `Recommendation ${index + 1}`);
    description = String(pick(rec, ["description", "detail", "text", "content"]) ?? "");
    priority = String(rec.priority ?? "");
  }
  if (!title) title = `Recommendation ${index + 1}`;

  const textX = ctx.margin + 16;
  const textWidth = ctx.contentWidth - 20 - (priority ? 22 : 0);
  doc.setFont(THEME.fonts.family, "normal");
  doc.setFontSize(9.5);
  const bodyLines: string[] = doc.splitTextToSize(description, textWidth);

  const cardH = Math.max(20, 8 + bodyLines.length * 4.6 + 6);
  addPageIfNeeded(ctx, cardH + 4);

  // Card background
  setFill(doc, THEME.colors.white);
  setDraw(doc, THEME.colors.grayBorder);
  doc.setLineWidth(0.4);
  doc.roundedRect(ctx.margin, ctx.y, ctx.contentWidth, cardH, 2.5, 2.5, "FD");

  // Left accent bar
  setFill(doc, THEME.colors.primaryBlue);
  doc.roundedRect(ctx.margin, ctx.y, 2.5, cardH, 1.2, 1.2, "F");

  // Numbered badge
  setFill(doc, THEME.colors.deepBlue);
  doc.circle(ctx.margin + 8, ctx.y + 9, 4.2, "F");
  setText(doc, THEME.colors.white);
  doc.setFont(THEME.fonts.family, "bold");
  doc.setFontSize(9);
  doc.text(String(index + 1), ctx.margin + 8, ctx.y + 10.3, { align: "center" });

  // Title
  setText(doc, THEME.colors.deepBlue);
  doc.setFont(THEME.fonts.family, "bold");
  doc.setFontSize(10.5);
  const titleMaxWidth = ctx.contentWidth - 20 - (priority ? 24 : 0);
  const titleLines = doc.splitTextToSize(title, titleMaxWidth);
  doc.text(titleLines, textX, ctx.y + 7);

  // Priority tag
  if (priority) {
    const pColor = priorityColor(priority);
    setFill(doc, pColor);
    const tagW = 20;
    doc.roundedRect(ctx.pageWidth - ctx.margin - tagW - 3, ctx.y + 3.5, tagW, 6.5, 3, 3, "F");
    setText(doc, THEME.colors.white);
    doc.setFont(THEME.fonts.family, "bold");
    doc.setFontSize(7.5);
    doc.text(priority.toUpperCase(), ctx.pageWidth - ctx.margin - tagW / 2 - 3, ctx.y + 7.7, { align: "center" });
  }

  // Description
  if (bodyLines.length) {
    setText(doc, THEME.colors.textDark);
    doc.setFont(THEME.fonts.family, "normal");
    doc.setFontSize(9.5);
    const bodyY = ctx.y + 7 + titleLines.length * 5 + 2;
    doc.text(bodyLines, textX, bodyY);
  }

  ctx.y += cardH + 5;
}

/** Renders the full Recommendations section */
function drawRecommendationsSection(ctx: PdfContext, report: ReportData): void {
  const recs = report.recommendations || [];
  if (recs.length === 0) return;

  drawSectionTitle(ctx, "Recommendations");
  recs.forEach((rec, i) => drawRecommendationCard(ctx, i, rec));
  ctx.y += 2;
}

/** Renders the Executive Summary block on the cover page */
function drawExecutiveSummarySection(ctx: PdfContext, report: ReportData): void {
  const { doc } = ctx;
  const summary = report.executive_summary || "No executive summary provided.";

  drawSectionTitle(ctx, "Executive Summary");

  doc.setFont(THEME.fonts.family, "normal");
  doc.setFontSize(10);
  const lines: string[] = doc.splitTextToSize(summary, ctx.contentWidth - 10);
  const boxH = lines.length * 5 + 10;

  addPageIfNeeded(ctx, boxH + 4);

  setFill(doc, THEME.colors.grayBg);
  setDraw(doc, THEME.colors.grayBorder);
  doc.setLineWidth(0.3);
  doc.roundedRect(ctx.margin, ctx.y, ctx.contentWidth, boxH, 2.5, 2.5, "FD");

  setText(doc, THEME.colors.textDark);
  doc.text(lines, ctx.margin + 5, ctx.y + 7);

  ctx.y += boxH + 8;
}

/** Renders the Conclusion block, styled as a closing panel with purple accent */
function drawConclusionSection(ctx: PdfContext, report: ReportData): void {
  const { doc } = ctx;
  const conclusion = report.conclusion ?? "This dataset is ready for business intelligence, visualization, forecasting, and AI-driven analytics. Based on the AI analysis, the dataset demonstrates high quality and is suitable for dashboards, forecasting, machine learning, and decision-making.";

  drawSectionTitle(ctx, "Conclusion");

  doc.setFont(THEME.fonts.family, "normal");
  doc.setFontSize(10);
  const lines: string[] = doc.splitTextToSize(conclusion, ctx.contentWidth - 10);
  const boxH = lines.length * 5 + 10;

  addPageIfNeeded(ctx, boxH + 4);

  setFill(doc, THEME.colors.lightPurple);
  setDraw(doc, THEME.colors.purple);
  doc.setLineWidth(0.4);
  doc.roundedRect(ctx.margin, ctx.y, ctx.contentWidth, boxH, 2.5, 2.5, "FD");

  setText(doc, THEME.colors.deepBlue);
  doc.text(lines, ctx.margin + 5, ctx.y + 7);

  ctx.y += boxH + 8;
  drawSeparator(ctx);
}

/* ============================================================================
 * 7. PUBLIC API
 * ==========================================================================*/

/**
 * Generates and downloads the full InsightForge AI Business Intelligence
 * PDF report from the given report data object.
 *
 * Usage:
 *   import { generatePdfReport } from "./pdfService";
 *   generatePdfReport(report);
 */
export function generatePdfReport(report: ReportData): void {
    console.log("PDF REPORT");
    console.log(report);
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const ctx = createContext(doc);

  // ---------------------------------------------------------------------
  // PAGE 1 — Cover, Executive Summary, KPI Overview
  // ---------------------------------------------------------------------
  drawHeroHeader(ctx, report);
  ctx.currentSection = "Executive Summary";
  drawExecutiveSummarySection(ctx, report);
  drawKpiSection(ctx, report);

  // ---------------------------------------------------------------------
  // PAGE 2 — Business Analysis
  // ---------------------------------------------------------------------
  doc.addPage();
  drawPageHeader(ctx, "Business Analysis");
  drawKeyStatisticsSection(ctx, report);
  drawBusinessInsightsSection(ctx, report);
  drawDatasetQualitySection(ctx, report);

  // ---------------------------------------------------------------------
  // PAGE 3 — Recommendations & Conclusion
  // ---------------------------------------------------------------------
  doc.addPage();
  drawPageHeader(ctx, "Recommendations & Conclusion");
  drawRecommendationsSection(ctx, report);
  drawConclusionSection(ctx, report);

  // ---------------------------------------------------------------------
  // Finalize — stamp footer + page numbers on every page
  // ---------------------------------------------------------------------
  finalizeFootersAndPageNumbers(doc, ctx.pageWidth, ctx.pageHeight, ctx.margin);

  doc.save(`${sanitizeFilename(report.title)}_Report.pdf`);
}

export default generatePdfReport;
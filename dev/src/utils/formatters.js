export function formatCurrency(value, locale = "pt-BR", currency = "BRL") {
  if (value == null || value === "") return "";
  const n = Number(value);
  if (Number.isNaN(n)) return String(value);
  return new Intl.NumberFormat(locale, { style: "currency", currency }).format(n);
}

export function formatDate(ts) {
  if (!ts) return "";
  const d = typeof ts.toDate === "function" ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString();
}

export function formatNumber(value, locale = "pt-BR", options = {}) {
  const n = Number(value);
  if (Number.isNaN(n)) return String(value);
  return new Intl.NumberFormat(locale, options).format(n);
}
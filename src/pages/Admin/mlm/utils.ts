import type { PaginatedResponse } from "../../../services/mlm";

export function formatCurrency(value?: number) {
  if (value == null || Number.isNaN(value)) return "—";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatBv(value?: number) {
  if (value == null || Number.isNaN(value)) return "—";
  return new Intl.NumberFormat("en-IN").format(value);
}

export function formatDate(value?: string) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

export function formatDateTime(value?: string) {
  if (!value) return "—";
  return new Date(value).toLocaleString("en-IN", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function currentPeriodKey() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${now.getFullYear()}-${month}`;
}

export function unwrapList<T>(data: PaginatedResponse<T> | T[] | undefined): {
  items: T[];
  total: number;
  page?: number;
  limit?: number;
  totalPages?: number;
} {
  if (!data) return { items: [], total: 0 };
  if (Array.isArray(data)) return { items: data, total: data.length };
  return {
    items: data.items ?? [],
    total: data.total ?? data.items?.length ?? 0,
    page: data.page,
    limit: data.limit,
    totalPages: data.totalPages,
  };
}

export function formatPhone(
  phone?: string,
  countryCode?: string,
  contactNo?: string
) {
  const number = phone ?? contactNo;
  if (!number) return "—";
  return countryCode ? `${countryCode} ${number}` : number;
}

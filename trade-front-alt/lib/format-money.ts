import { normalizeAccountCurrency, type AccountCurrency } from './currency';

export type MoneyDisplaySize = 'xs' | 'sm' | 'md' | 'lg' | 'hero';

/** Uzun para metinlerinde kutudan taşmayı önlemek için yazı boyutu. */
export function moneyTextSizeClass(
  formatted: string,
  base = 'text-lg font-bold',
): string {
  const len = formatted.length;
  if (len > 18) return 'text-[10px] font-bold leading-tight sm:text-xs';
  if (len > 14) return 'text-xs font-bold leading-tight sm:text-sm';
  if (len > 11) return 'text-sm font-bold leading-tight sm:text-base';
  if (len > 9) return 'text-base font-bold leading-tight sm:text-lg';
  return base;
}

export function moneyHeroSizeClass(formatted: string): string {
  const len = formatted.length;
  if (len > 18) return 'text-sm font-bold leading-tight sm:text-base';
  if (len > 14) return 'text-base font-bold leading-tight sm:text-lg';
  if (len > 11) return 'text-lg font-bold leading-tight sm:text-xl';
  if (len > 9) return 'text-xl font-bold leading-tight sm:text-2xl';
  return 'text-2xl font-bold leading-tight sm:text-3xl md:text-4xl';
}

export function formatMoney(
  value: number,
  opts?: {
    fractionDigits?: number;
    dynamic?: boolean;
    currency?: string;
  },
): string {
  const currency = normalizeAccountCurrency(opts?.currency) as AccountCurrency;
  let fractionDigits = opts?.fractionDigits;
  if (fractionDigits == null) {
    if (opts?.dynamic) {
      const abs = Math.abs(value);
      if (!Number.isFinite(value) || value === 0) fractionDigits = 2;
      else if (abs >= 1) fractionDigits = 2;
      else if (abs >= 0.01) fractionDigits = 4;
      else if (abs >= 0.0001) fractionDigits = 6;
      else fractionDigits = 8;
    } else {
      fractionDigits = 2;
    }
  }
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency,
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value);
}

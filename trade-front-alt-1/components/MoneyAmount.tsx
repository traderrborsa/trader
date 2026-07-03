import {
  formatMoney,
  moneyHeroSizeClass,
  moneyTextSizeClass,
} from '@/lib/format-money';

type FormatOpts = Parameters<typeof formatMoney>[1];

const SIZE_BASE: Record<string, string> = {
  card: 'text-2xl font-semibold',
  compact: 'text-lg font-bold',
  inline: 'text-sm font-mono font-medium',
  header: 'text-sm font-mono font-medium',
  menu: 'text-lg font-bold',
};

interface MoneyAmountProps {
  amount: number;
  opts?: FormatOpts;
  size?: keyof typeof SIZE_BASE | 'hero';
  className?: string;
  as?: 'p' | 'span';
}

export function MoneyAmount({
  amount,
  opts,
  size = 'card',
  className = '',
  as: Tag = 'p',
}: MoneyAmountProps) {
  const formatted = formatMoney(amount, opts);
  const sizeClass =
    size === 'hero'
      ? moneyHeroSizeClass(formatted)
      : moneyTextSizeClass(formatted, SIZE_BASE[size] ?? SIZE_BASE.card);

  return (
    <Tag
      className={`min-w-0 max-w-full overflow-hidden tabular-nums tracking-tight break-all [overflow-wrap:anywhere] ${sizeClass} ${className}`}
      title={formatted}
    >
      {formatted}
    </Tag>
  );
}

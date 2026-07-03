import { randomInt } from 'crypto';
import type { Prisma } from '@prisma/client';

type Tx = Prisma.TransactionClient;

const MAX_ATTEMPTS = 25;

function randomCustomerSlug(): string {
  return String(randomInt(0, 100_000_000)).padStart(8, '0');
}

export async function allocateCustomerSlug(tx: Tx): Promise<string> {
  for (let i = 0; i < MAX_ATTEMPTS; i++) {
    const customerSlug = randomCustomerSlug();
    const exists = await tx.user.findUnique({
      where: { customerSlug },
      select: { id: true },
    });
    if (!exists) return customerSlug;
  }
  throw new Error('Benzersiz müşteri ID üretilemedi');
}

export async function backfillCustomerSlugs(tx: Tx) {
  const rows = await tx.user.findMany({
    where: { customerSlug: null },
    select: { id: true },
    orderBy: { createdAt: 'asc' },
  });

  for (const row of rows) {
    const customerSlug = await allocateCustomerSlug(tx);
    await tx.user.update({
      where: { id: row.id },
      data: { customerSlug },
    });
  }
}

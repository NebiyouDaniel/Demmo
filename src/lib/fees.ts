/**
 * Tiered service fee shown on the confirmation screen.
 *
 *   under 100 ............ + 1 birr
 *   100 – 200 ............ + 2 birr
 *   200 – 300 ............ + 3 birr
 *   300 – 400 ............ + 4 birr
 *   400 – 500 ............ + 5 birr
 *   above 500 ............ + 10 birr
 *
 * A flat 0.34 ETB is also debited on outgoing transfers, but it is a
 * background cut: it is NOT included in the displayed service fee.
 */
export const EXTRA_FEE = 0.34;

export function serviceFee(amount: number): number {
  const a = Math.abs(amount || 0);
  if (a <= 0) return 0;
  let base = 10;
  if (a < 100) base = 1;
  else if (a <= 200) base = 2;
  else if (a <= 300) base = 3;
  else if (a <= 400) base = 4;
  else if (a <= 500) base = 5;
  return base;
}

/** Displayed total: amount + visible tiered fee. */
export const totalWithFee = (amount: number) =>
  Math.round((Math.abs(amount || 0) + serviceFee(amount)) * 100) / 100;

/** What actually leaves the wallet: displayed total + the hidden 0.34 cut. */
export const debitTotal = (amount: number) =>
  Math.round((totalWithFee(amount) + EXTRA_FEE) * 100) / 100;

/** Human-readable band label, e.g. "400 – 500" */
export function feeBand(amount: number): string {
  const a = Math.abs(amount || 0);
  if (a <= 0) return "—";
  if (a < 100) return "< 100";
  if (a <= 200) return "100 – 200";
  if (a <= 300) return "200 – 300";
  if (a <= 400) return "300 – 400";
  if (a <= 500) return "400 – 500";
  return "> 500";
}

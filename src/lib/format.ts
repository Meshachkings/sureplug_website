export const formatNaira = (amount: number | undefined | null) =>
  `₦${(amount ?? 0).toLocaleString('en-NG')}`;

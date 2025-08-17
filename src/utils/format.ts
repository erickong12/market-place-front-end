export const money = (n: number | string = 0, currency: string = "IDR", locale: string = "en-US"): string => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(Number(n));
};

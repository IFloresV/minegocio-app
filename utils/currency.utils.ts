export const parseStringToNumber = (str: string): number => {
   // Convierte strings como "25,220.52" a números
   return parseFloat(str.replace(/,/g, "")) || 0;
};

export const formatCurrency = (amount: number | string): string => {
   const numAmount = typeof amount === "string" ? parseStringToNumber(amount) : amount;
   return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 2,
   }).format(numAmount);
};

export const formatPercentage = (percentage: number): string => {
   return `${percentage.toFixed(1)}%`;
};

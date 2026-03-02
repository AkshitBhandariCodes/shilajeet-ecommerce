// Fire Coins configuration for products
export const PRODUCT_FIRE_COINS: { [key: string]: number } = {
  'agnishila-trublk-gold-resin': 65,
  'agnishila-shilajit-gummies': 50,
  'ashwa-glo-gummies': 54
};

export function getProductFireCoins(productId: string): number {
  return PRODUCT_FIRE_COINS[productId] || 0;
}

export function calculateTotalFireCoins(items: { id: string; quantity: number }[]): number {
  return items.reduce((total, item) => {
    const coinsPerItem = getProductFireCoins(item.id);
    return total + (coinsPerItem * item.quantity);
  }, 0);
}

export function convertCoinsToRupees(coins: number): number {
  return coins; // 1 Fire Coin = ₹1
}

export function convertRupeesToCoins(rupees: number): number {
  return rupees; // ₹1 = 1 Fire Coin
}

export const COLORS = {
  primary: '#00BFA5', // Teal/Emerald from the logo
  secondary: '#00796B',
  accent: '#FFD740',
  background: '#F8F9FA',
  surface: '#FFFFFF',
  error: '#FF5252',
  text: '#212121',
  textSecondary: '#757575',
  border: '#E0E0E0',
  success: '#4CAF50',
  warning: '#FB8C00',
  card: '#FFFFFF',
  dark: {
    background: '#121212',
    surface: '#1E1E1E',
    text: '#FFFFFF',
    textSecondary: '#B0B0B0',
    border: '#333333',
  }
};

export const CATEGORIES = [
  { id: 'food', name: 'Food', icon: 'fast-food', color: '#FF7043' },
  { id: 'transport', name: 'Transport', icon: 'car', color: '#42A5F5' },
  { id: 'bills', name: 'Bills', icon: 'receipt', color: '#AB47BC' },
  { id: 'shopping', name: 'Shopping', icon: 'cart', color: '#EC407A' },
  { id: 'health', name: 'Health', icon: 'medkit', color: '#66BB6A' },
  { id: 'entertainment', name: 'Entertainment', icon: 'game-controller', color: '#FFA726' },
  { id: 'other', name: 'Other', icon: 'ellipsis-horizontal', color: '#78909C' },
];

export const PAYMENT_METHODS = [
  { id: 'cash', name: 'Cash', icon: 'cash-outline' },
  { id: 'card', name: 'Card', icon: 'card-outline' },
  { id: 'transfer', name: 'Transfer', icon: 'swap-horizontal-outline' },
];

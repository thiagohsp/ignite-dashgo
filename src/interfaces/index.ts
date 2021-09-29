export interface IBankAccount {
  id: number;
  bank: string;
  title: string;
}

export interface ICategory {
  id: number;
  group: string;
  description: string;
  type?: 'income' | 'expense' | 'transfer';
  is_hide: boolean
}

export interface IOption {
  value: string | number;
  label: string;
}
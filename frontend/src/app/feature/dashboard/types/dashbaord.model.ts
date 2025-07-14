// src/app/models/transaction.model.ts (or wherever you keep your models)
export interface Transaction {
  id: string;
  nature: 'normal' | 'split';
  type: 'expense' | 'income' | 'transfer';
  category: {
    id: string;
    name: string;
    description: string;
    created_at: string;
    updated_at: string;
  } | null; // Category can be null for transfers
  description: string;
  amount: string; // Keep as string if it comes from API as string
  account: {
    id: string;
    name: string;
    description: string;
    balance: string;
    is_deleted: boolean;
    created_at: string;
    updated_at: string;
  } | null; // Account can be null for some cases, e.g., if only card/upi is used directly
  card: {
    id: string;
    card_name: string;
    card_number: string;
    type: string;
    balance: string;
    credit_limit: string;
    is_deleted: boolean;
    created_at: string;
    updated_at: string;
  } | null;
  upi: {
    id: string;
    upi_name: string;
    upi_id: string;
    is_deleted: boolean;
    created_at: string;
    updated_at: string;
  } | null;
  split_users: any[]; // Define a proper interface for split users later
  files: any[];
  comments: any[];
  transaction_date: string;
  is_paid: boolean;
  created_at: string;
  updated_at: string;
}

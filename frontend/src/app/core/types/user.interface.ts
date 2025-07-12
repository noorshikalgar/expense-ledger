export interface UserInfo {
  id: string;
  first_name: string;
  last_name: string;
  mobile: string;
  username: string;
  email: string;
  password: string;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  nature: string;
  type: string;
  description: string;
  amount: string;
  transaction_date: string;
  is_paid: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface Account {
  id: string;
  name: string;
  description: string;
  balance: string;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}
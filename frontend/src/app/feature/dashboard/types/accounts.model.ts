import { GetAPIBaseFilters } from "./common.model";

export interface Account {
  id: string;
  name: string;
  description: string;
  balance: string;
  is_deleted: boolean;
  cards: Card[];
  upis: Upi[];
  created_at: string;
  updated_at: string;
}

export interface Upi {
  id: string;
  upi: string;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface Card {
  id: string;
  card_name: string;
  card_number: string;
  type: string;
  balance: string;
  credit_limit: string;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface AccountFetchFilters extends GetAPIBaseFilters {}
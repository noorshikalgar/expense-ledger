import { GetAPIBaseFilters } from "./common.model";

export interface TransactionFetchFilters extends GetAPIBaseFilters {
    startDate?: number;
    endDate?: number;
}
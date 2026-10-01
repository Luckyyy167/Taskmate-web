import { type PaginationMeta } from '@/types';

export interface PaginationParams {
  page: number;
  limit: number;
}

export function getPaginationOffset(page: number, limit: number): number {
  return (page - 1) * limit;
}

export function buildPaginationMeta(total: number, page: number, limit: number): PaginationMeta {
  return {
    total,
    page,
    limit,
    total_pages: Math.ceil(total / limit),
  };
}

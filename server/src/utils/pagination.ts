import { PaginationParams } from '../types';

export const getPaginationParams = (query: any, defaultLimit = 20, maxLimit = 100): PaginationParams => {
  const page = Math.max(1, parseInt(query.page as string, 10) || 1);
  const rawLimit = parseInt(query.limit as string, 10) || defaultLimit;
  const limit = Math.min(Math.max(1, rawLimit), maxLimit);
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};


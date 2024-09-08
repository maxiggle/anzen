import { NextFunction, Response, Request } from 'express';
import NodeCache from 'node-cache'
import { Handler } from '../dtos/types';

export const cache = new NodeCache({
  checkperiod: 120,
  stdTTL: 100,
});

export const catchErrors = (fn: Handler) => {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      await fn(req, res, next)
    } catch (error) {
      next(error);
    }
  }
};

export function extractIdFromUrl(url: string): number | null {
  const parts = url.trimEnd().split('/');
  const lastPart = parts[parts.length - 2];

  if (!isNaN(Number(lastPart))) {
    return Number(lastPart);
  }

  return null;
}

export function pickFields<T extends object, K extends keyof T>(
  arr: T[],
  keys: K[]
): Pick<T, K>[] {
  return arr.map((obj) => {
    const picked: Partial<Pick<T, K>> = {}
    keys.forEach((key) => {
      picked[key] = obj[key]
    })
    return picked as Pick<T, K>
  })
}

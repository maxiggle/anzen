import { useLocation } from "react-router-dom";

export function isLinkActive(location: ReturnType<typeof useLocation>) {
  return (path: string) => {
    return location.pathname === path;
  };
}

export function clsx(obj: Record<string, boolean> | string[] | (string | undefined | boolean)[] = []): string {
  if (Array.isArray(obj)) {
    return obj.filter((e) => e).join(" ");
  }

  if (typeof obj === 'object') {
    return Object.entries(obj).filter(([_cls, state]: [string, boolean]) => state && _cls).map(([_class]: [string, boolean]) => _class).join(' ')
  }

  return '';
}

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

/** 为 public 下的本地资源拼接 GitHub Pages 所需的 basePath。 */
export function assetPath(path: string): string {
  if (!path.startsWith('/')) return path;
  return `${basePath}${path}`;
}

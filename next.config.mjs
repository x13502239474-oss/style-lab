/** @type {import('next').NextConfig} */

// GitHub Pages 部署时把 NEXT_PUBLIC_BASE_PATH 设为仓库名，例如 "/style-lab"。
// 本地开发留空即可，脚本与图片路径会自动带上前缀。
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

const nextConfig = {
  output: 'export',
  basePath,
  assetPrefix: basePath,
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
};

export default nextConfig;

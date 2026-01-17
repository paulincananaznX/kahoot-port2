/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Ensure we can use local images if needed, though mostly using internal assets
  images: {
    domains: [],
  },
}

export default nextConfig;

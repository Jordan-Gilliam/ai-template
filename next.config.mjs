/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: true,
  },
  // experimental: {
  //   fontLoaders: [
  //     {
  //       loader: "@next/font/google",
  //     },
  //   ],
  // },
}

export default nextConfig

/** @type {import('next').NextConfig} */
const nextConfig = {
  logging: false,
  compiler: {
    removeConsole: { exclude: ["error"] },
  },
}

export default nextConfig

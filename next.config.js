/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    FLOW_NETWORK: process.env.FLOW_NETWORK,
    NEXT_PUBLIC_FLOW_ACCESS_NODE: process.env.NEXT_PUBLIC_FLOW_ACCESS_NODE,
    NEXT_PUBLIC_FLOW_WALLET_DISCOVERY: process.env.NEXT_PUBLIC_FLOW_WALLET_DISCOVERY,
  },
  reactStrictMode: true,
  swcMinify: true,
}

module.exports = nextConfig

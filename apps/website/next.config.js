/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: { ignoreBuildErrors: true },

  redirects: async () => {
    return [
      {
        source: '/',
        destination: '/playgrounds',
        permanent: false,
      },
      {
        // (?:[a-z]{2,3}(-[A-Z][a-z]+)?(-[A-Z]{2}|\d{3})?)
        source: '/:locale((?:[a-zA-Z]{2})(?:-[a-zA-Z]{2})?)',
        destination: '/:locale/playgrounds',
        permanent: false,
      },
    ];
  },
  rewrites: async () => [
    {
      source: '/api/ingest/static/:path*',
      destination: 'https://us-assets.i.posthog.com/static/:path*',
    },
    {
      source: '/api/ingest/:path*',
      destination: 'https://us.i.posthog.com/:path*',
    },
    {
      source: '/api/journal/static/:path*',
      destination: 'https://us-assets.i.posthog.com/static/:path*',
    },
    {
      source: '/api/journal/:path*',
      destination: 'https://us.i.posthog.com/:path*',
    },
  ],
  skipTrailingSlashRedirect: true,

  images: {
    localPatterns: [{ pathname: '/images/**' }],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
        pathname: '/PKief/vscode-material-icon-theme/main/icons/**',
      },
    ],
  },
};

const truthy = (v) => ['true', 't', '1'].includes(v);
export default truthy(process.env.ANALYSE)
  ? (await import('@next/bundle-analyzer')).default({ enabled: true })(nextConfig)
  : nextConfig;

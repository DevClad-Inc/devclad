/** @type {import('next').NextConfig} */
const withTM = require('next-transpile-modules')(['@devclad/ui', '@devclad/lib']);

const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,
	experimental: {
		fontLoaders: [{ loader: '@next/font/google', options: { subsets: ['latin'] } }],
	},
	images: {
		dangerouslyAllowSVG: true,
		domains: ['imagedelivery.net', 'api.producthunt.com'],
	},
	headers: async () => {
		return [
			{
				source: '/(.*)',
				headers: [
					{
						key: 'X-Frame-Options',
						value: 'SAMEORIGIN',
					},
					{
						key: 'X-XSS-Protection',
						value: '1; mode=block',
					},
					{
						key: 'X-Content-Type-Options',
						value: 'nosniff',
					},
					{
						key: 'Referrer-Policy',
						value: 'strict-origin-when-cross-origin',
					},
				],
			},
		];
	},
};

module.exports = withTM(nextConfig);

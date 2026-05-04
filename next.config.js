/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "img.youtube.com",
				port: "",
				pathname: "/vi/**",
			},
			{
				protocol: "https",
				hostname: "lh3.googleusercontent.com",
				port: "",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "*.mzstatic.com",
				port: "",
				pathname: "/**",
			},
		],
		// 画像の最適化を無効にする設定 Vercelの無料プランでは1000枚までしか最適化できない。
		unoptimized: true,
	},
};

module.exports = nextConfig;

// Injected content via Sentry wizard below

const { withSentryConfig } = require("@sentry/nextjs");

module.exports = withSentryConfig(module.exports, {
	// For all available options, see:
	// https://www.npmjs.com/package/@sentry/webpack-plugin#options

	org: "tometome",
	project: "archives-ver-3-series-web",

	// Only print logs for uploading source maps in CI
	// silent: !process.env.CI,
	// 本番環境ではログを非表示にする
	silent: process.env.NEXT_PUBLIC_STAGE === "prod",

	// For all available options, see:
	// https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

	// Upload a larger set of source maps for prettier stack traces (increases build time)
	widenClientFileUpload: true,

	// Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
	// This can increase your server load as well as your hosting bill.
	// Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
	// side errors will fail.
	tunnelRoute: "/monitoring",

	// ✔ 新方式（重要）
	webpack: (config) => {
		config.treeshake = {
			removeDebugLogging: true,
		};

		config.automaticVercelMonitors = true;

		return config;
	},
});

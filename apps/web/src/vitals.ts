/* eslint-disable import/prefer-default-export */
import { onCLS, onFCP, onFID, onLCP, onTTFB, Metric } from 'web-vitals';

const vitalsUrl = 'https://vitals.vercel-analytics.com/v1/vitals';

function getConnectionSpeed() {
	return 'connection' in navigator &&
		(navigator as Navigator & { connection: { effectiveType: string } }).connection
			.effectiveType
		? (navigator as any).connection.effectiveType
		: 'unknown';
}

function sendToAnalytics(
	metric: Metric,
	options: {
		params: { [s: string]: any } | ArrayLike<any>;
		path: string;
		analyticsId: string;
		debug: boolean;
	}
) {
	const page = Object.entries(options.params).reduce(
		(acc, [key, value]) => acc.replace(value, `[${key}]`),
		options.path
	);

	const body = {
		dsn: options.analyticsId, // qPgJqYH9LQX5o31Ormk8iWhCxZO
		id: metric.id, // v2-1653884975443-1839479248192
		page, // /blog/[slug]
		// eslint-disable-next-line no-restricted-globals
		href: location.href, // https://my-app.vercel.app/blog/my-test
		event_name: metric.name, // TTFB
		value: metric.value.toString(), // 60.20000000298023
		speed: getConnectionSpeed(), // 4g
	};

	if (options.debug) {
		console.log('[Analytics]', metric.name, JSON.stringify(body, null, 2));
	}

	const blob = new Blob([new URLSearchParams(body).toString()], {
		// This content type is necessary for `sendBeacon`
		type: 'application/x-www-form-urlencoded',
	});
	if (navigator.sendBeacon) {
		navigator.sendBeacon(vitalsUrl, blob);
	} else
		fetch(vitalsUrl, {
			body: blob,
			method: 'POST',
			credentials: 'omit',
			keepalive: true,
		});
}

export function webVitals(options: {
	params: { [s: string]: any } | ArrayLike<any>;
	path: string;
	analyticsId: string;
	debug: boolean;
}) {
	try {
		onFID((metric) => sendToAnalytics(metric, options));
		onTTFB((metric) => sendToAnalytics(metric, options));
		onLCP((metric) => sendToAnalytics(metric, options));
		onCLS((metric) => sendToAnalytics(metric, options));
		onFCP((metric) => sendToAnalytics(metric, options));
	} catch (err) {
		console.error('[Analytics]', err);
	}
}

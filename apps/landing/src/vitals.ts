import type { Metric } from 'web-vitals';

const vitalsUrl = 'https://vitals.vercel-analytics.com/v1/vitals';

function getConnectionSpeed() {
	return 'connection' in navigator && (navigator as any).connection.effectiveType
		? (navigator as any).connection.effectiveType
		: 'unknown';
}

// eslint-disable-next-line import/prefer-default-export
export function sendToVercelAnalytics(metric: Metric) {
	const analyticsId = import.meta.env.REACT_APP_VERCEL_ANALYTICS_ID;
	if (!analyticsId) {
		return;
	}

	const body = {
		dsn: analyticsId,
		id: metric.id,
		page: window.location.pathname,
		href: window.location.href,
		event_name: metric.name,
		value: metric.value.toString(),
		speed: getConnectionSpeed(),
	};

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

export function interpolatePosition(
	start: { lat: number; lon: number },
	end: { lat: number; lon: number },
	month: number
): { lat: number; lon: number } {
	const t = month / 11; // normalize 0–11 to 0.0–1.0
	return {
		lat: start.lat + (end.lat - start.lat) * t,
		lon: start.lon + (end.lon - start.lon) * t
	};
}

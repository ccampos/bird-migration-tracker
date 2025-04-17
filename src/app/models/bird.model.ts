export interface Bird {
	name: string;
	species: string;
	region: string;
	season: string;
	location: {
		lat: number;
		lon: number;
	};
	destination: {
		lat: number;
		lon: number;
	}
}
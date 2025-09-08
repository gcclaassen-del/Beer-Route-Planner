export interface Brewery {
  id: string;
  name: string;
  address: string;
  coords: [number, number];
}

export interface LocationPoint {
  address: string;
  coords: [number, number] | null;
}
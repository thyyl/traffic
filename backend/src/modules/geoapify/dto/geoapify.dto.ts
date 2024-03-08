export class PostReverseResponseBody {
  id: string;
  status: string;
  url: string;
}

interface Query {
  lon: number;
  lat: number;
  plus_code: string;
}

interface Datasource {
  sourcename: string;
  attribution: string;
  license: string;
  url: string;
}

interface Timezone {
  name: string;
  offset_STD: string;
  offset_STD_seconds: number;
  offset_DST: string;
  offset_DST_seconds: number;
  abbreviation_STD: string;
  abbreviation_DST: string;
}

interface Rank {
  importance: number;
  popularity: number;
}

interface Address {
  query: Query;
  datasource: Datasource;
  country: string;
  country_code: string;
  state: string;
  county: string;
  city: string;
  postcode: string;
  street: string;
  quarter?: string;
  housenumber: string;
  lon: number;
  lat: number;
  distance: number;
  result_type: string;
  district: string;
  formatted: string;
  address_line1: string;
  address_line2: string;
  category: string;
  timezone: Timezone;
  plus_code: string;
  rank: Rank;
  place_id: string;
}

export class ReverseLocationResponse implements Address {
  query: Query;
  datasource: Datasource;
  country: string;
  country_code: string;
  state: string;
  county: string;
  city: string;
  suburb: string;
  postcode: string;
  street: string;
  housenumber: string;
  lon: number;
  lat: number;
  distance: number;
  result_type: string;
  district: string;
  formatted: string;
  address_line1: string;
  address_line2: string;
  category: string;
  timezone: Timezone;
  plus_code: string;
  rank: Rank;
  place_id: string;
}

export class ReverseLocationPendingResponse {
  id: string;
  status: string;
}

export type GeoApifyResponse =
  | ReverseLocationPendingResponse
  | ReverseLocationResponse[];

export interface ApiCheckConfig {
  apiKey: string;
  referer?: string;
}

export interface LookupResponse {
  street: string;
  streetShort?: string;
  number: string;
  numberAddition?: string;
  postalcode: string;
  city: string;
  cityShort?: string;
  municipality?: string;
  country: Country;
  coordinates: Coordinates;
}

export interface Country {
  name: string;
  code: string;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface NumberAdditionsResponse {
  number: string;
  numberAdditions: string[];
}

export interface GlobalSearchResponse {
  results: SearchResult[];
  count: number;
}

export interface SearchResult {
  id: number;
  name: string;
  type: string;
  latitude?: number;
  longitude?: number;
}

export interface EmailVerificationResponse {
  email: string;
  status: 'valid' | 'invalid' | 'unknown';
  disposable_email: boolean;
  greylisted: boolean;
}

export interface PhoneVerificationResponse {
  number: string;
  valid: boolean;
  country_code?: string;
  carrier?: string;
}

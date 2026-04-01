import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

const API_ENDPOINT = 'https://api.apicheck.nl';

export const COUNTRIES_ALL = ['nl', 'be', 'lu', 'de', 'fr', 'cz', 'fi', 'it', 'no', 'pl', 'pt', 'ro', 'es', 'ch', 'at', 'dk', 'gb', 'se'] as const;
export const COUNTRIES_LOOKUP = ['nl', 'lu'] as const;

export type CountryCode = typeof COUNTRIES_ALL[number];
export type LookupCountryCode = typeof COUNTRIES_LOOKUP[number];

export interface LookupQuery {
  postalcode: string;
  number: string | number;
  numberAddition?: string;
}

export interface GlobalSearchParams {
  query: string;
  limit?: number;
  city_id?: number;
  street_id?: number;
  postalcode_id?: number;
  locality_id?: number;
  municipality_id?: number;
}

export interface SearchParams {
  name: string;
  limit?: number;
  city_id?: number;
}

export interface AddressSearchParams {
  street_id?: number;
  city_id?: number;
  postalcode_id?: number;
  locality_id?: number;
  municipality_id?: number;
  number?: string;
  numberAddition?: string;
  limit?: number;
}

@Injectable({ providedIn: 'root' })
export class ApiCheckService {
  private headers: Record<string, string>;

  constructor(private http: HttpClient) {
    this.headers = { Accept: 'application/json' };
  }

  setApiKey(apiKey: string): void {
    this.headers['X-API-KEY'] = apiKey;
  }

  setReferer(referer: string): void {
    this.headers['Referer'] = referer;
  }

  // ============================================
  // Lookup API (Netherlands, Luxembourg only)
  // ============================================

  lookup(country: LookupCountryCode, query: LookupQuery): Observable<any> {
    let params = new HttpParams()
      .set('postalcode', query.postalcode)
      .set('number', String(query.number));
    if (query.numberAddition) {
      params = params.set('numberAddition', query.numberAddition);
    }
    
    return this.http.get<any>(
      `${API_ENDPOINT}/lookup/v1/postalcode/${country.toLowerCase()}`,
      { headers: this.headers, params }
    ).pipe(map(res => res.data || res));
  }

  getNumberAdditions(country: LookupCountryCode, postalcode: string, number: string | number): Observable<any> {
    return this.http.get<any>(
      `${API_ENDPOINT}/lookup/v1/address/${country.toLowerCase()}`,
      { 
        headers: this.headers,
        params: { postalcode, number: String(number), fields: '["numberAdditions"]' }
      }
    ).pipe(map(res => res.data || res));
  }

  // ============================================
  // Search API (18 European countries)
  // ============================================

  globalSearch(country: CountryCode, params: GlobalSearchParams): Observable<any[]> {
    let httpParams = new HttpParams().set('query', params.query);
    if (params.limit) httpParams = httpParams.set('limit', params.limit);
    if (params.city_id) httpParams = httpParams.set('city_id', params.city_id);
    if (params.street_id) httpParams = httpParams.set('street_id', params.street_id);
    if (params.postalcode_id) httpParams = httpParams.set('postalcode_id', params.postalcode_id);
    if (params.locality_id) httpParams = httpParams.set('locality_id', params.locality_id);
    if (params.municipality_id) httpParams = httpParams.set('municipality_id', params.municipality_id);
    
    return this.http.get<any>(
      `${API_ENDPOINT}/search/v1/global/${country.toLowerCase()}`,
      { headers: this.headers, params: httpParams }
    ).pipe(map(res => {
      const data = res.data || res;
      const results: any[] = [];
      if (data?.Results) {
        if (data.Results.Streets) results.push(...data.Results.Streets.map((s: any) => ({ ...s, type: 'street' })));
        if (data.Results.Cities) results.push(...data.Results.Cities.map((c: any) => ({ ...c, type: 'city' })));
        if (data.Results.Postalcodes) results.push(...data.Results.Postalcodes.map((p: any) => ({ ...p, type: 'postalcode' })));
      }
      return results.slice(0, params.limit || 10);
    }));
  }

  searchCity(country: CountryCode, params: SearchParams): Observable<any> {
    let httpParams = new HttpParams().set('name', params.name);
    if (params.limit) httpParams = httpParams.set('limit', params.limit);
    if (params.city_id) httpParams = httpParams.set('city_id', params.city_id);
    
    return this.http.get<any>(
      `${API_ENDPOINT}/search/v1/city/${country.toLowerCase()}`,
      { headers: this.headers, params: httpParams }
    ).pipe(map(res => res.data || res));
  }

  searchStreet(country: CountryCode, params: SearchParams): Observable<any> {
    let httpParams = new HttpParams().set('name', params.name);
    if (params.limit) httpParams = httpParams.set('limit', params.limit);
    if (params.city_id) httpParams = httpParams.set('city_id', params.city_id);
    
    return this.http.get<any>(
      `${API_ENDPOINT}/search/v1/street/${country.toLowerCase()}`,
      { headers: this.headers, params: httpParams }
    ).pipe(map(res => res.data || res));
  }

  searchPostalcode(country: CountryCode, params: SearchParams): Observable<any> {
    let httpParams = new HttpParams().set('name', params.name);
    if (params.limit) httpParams = httpParams.set('limit', params.limit);
    if (params.city_id) httpParams = httpParams.set('city_id', params.city_id);
    
    return this.http.get<any>(
      `${API_ENDPOINT}/search/v1/postalcode/${country.toLowerCase()}`,
      { headers: this.headers, params: httpParams }
    ).pipe(map(res => res.data || res));
  }

  searchLocality(country: CountryCode, name: string, limit?: number): Observable<any> {
    let httpParams = new HttpParams().set('name', name);
    if (limit) httpParams = httpParams.set('limit', limit);
    
    return this.http.get<any>(
      `${API_ENDPOINT}/search/v1/locality/${country.toLowerCase()}`,
      { headers: this.headers, params: httpParams }
    ).pipe(map(res => res.data || res));
  }

  searchMunicipality(country: CountryCode, name: string, limit?: number): Observable<any> {
    let httpParams = new HttpParams().set('name', name);
    if (limit) httpParams = httpParams.set('limit', limit);
    
    return this.http.get<any>(
      `${API_ENDPOINT}/search/v1/municipality/${country.toLowerCase()}`,
      { headers: this.headers, params: httpParams }
    ).pipe(map(res => res.data || res));
  }

  searchAddress(country: CountryCode, params: AddressSearchParams): Observable<any> {
    let httpParams = new HttpParams();
    if (params.street_id) httpParams = httpParams.set('street_id', params.street_id);
    if (params.city_id) httpParams = httpParams.set('city_id', params.city_id);
    if (params.postalcode_id) httpParams = httpParams.set('postalcode_id', params.postalcode_id);
    if (params.locality_id) httpParams = httpParams.set('locality_id', params.locality_id);
    if (params.municipality_id) httpParams = httpParams.set('municipality_id', params.municipality_id);
    if (params.number) httpParams = httpParams.set('number', params.number);
    if (params.numberAddition) httpParams = httpParams.set('numberAddition', params.numberAddition);
    if (params.limit) httpParams = httpParams.set('limit', params.limit);
    
    return this.http.get<any>(
      `${API_ENDPOINT}/search/v1/address/${country.toLowerCase()}`,
      { headers: this.headers, params: httpParams }
    ).pipe(map(res => res.data || res));
  }

  // ============================================
  // Verify API
  // ============================================

  verifyEmail(email: string): Observable<any> {
    return this.http.get<any>(
      `${API_ENDPOINT}/verify/v1/email/`,
      { headers: this.headers, params: { email } }
    ).pipe(map(res => res.data || res));
  }

  verifyPhone(number: string): Observable<any> {
    return this.http.get<any>(
      `${API_ENDPOINT}/verify/v1/phone/`,
      { headers: this.headers, params: { number } }
    ).pipe(map(res => res.data || res));
  }
}

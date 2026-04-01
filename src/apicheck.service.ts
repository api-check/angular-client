import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

const API_ENDPOINT = 'https://api.apicheck.nl';

@Injectable({ providedIn: 'root' })
export class ApiCheckService {
  private headers: Record<string, string>;

  constructor(private http: HttpClient) {
    this.headers = { Accept: 'application/json' };
  }

  setApiKey(apiKey: string): void {
    this.headers['X-API-KEY'] = apiKey;
  }

  // Lookup API (NL, LU)
  lookup(country: string, postalcode: string, number: string | number): Observable<any> {
    return this.http.get<any>(
      `${API_ENDPOINT}/lookup/v1/postalcode/${country.toLowerCase()}`,
      { 
        headers: this.headers,
        params: { postalcode, number: String(number) }
      }
    ).pipe(map(res => res.data || res));
  }

  getNumberAdditions(country: string, postalcode: string, number: string | number): Observable<any> {
    return this.http.get<any>(
      `${API_ENDPOINT}/lookup/v1/address/${country.toLowerCase()}`,
      { 
        headers: this.headers,
        params: { postalcode, number: String(number), fields: '["numberAdditions"]' }
      }
    ).pipe(map(res => res.data || res));
  }

  // Search API
  globalSearch(country: string, query: string, limit?: number): Observable<any[]> {
    const params: any = { query };
    if (limit) params.limit = limit;
    
    return this.http.get<any>(
      `${API_ENDPOINT}/search/v1/global/${country.toLowerCase()}`,
      { headers: this.headers, params }
    ).pipe(map(res => res.data?.Results || res.Results || []));
  }

  // Verify API
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

import { Injectable, Inject, InjectionToken } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import {
  LookupResponse,
  NumberAdditionsResponse,
  GlobalSearchResponse,
  EmailVerificationResponse,
  PhoneVerificationResponse,
} from './public_api';

export const APICHECK_CONFIG = new InjectionToken<ApiCheckConfig>('APICHECK_CONFIG');

export interface ApiCheckConfig {
  apiKey: string;
  referer?: string;
}

const API_ENDPOINT = 'https://api.apicheck.nl';
const LOOKUP_COUNTRIES = ['nl', 'lu'];
const SEARCH_COUNTRIES = ['nl', 'be', 'lu', 'fr', 'de', 'cz', 'fi', 'it', 'no', 'pl', 'pt', 'ro', 'es', 'ch', 'at', 'dk', 'gb', 'se'];

@Injectable({
  providedIn: 'root',
})
export class ApiCheckService {
  private headers: Record<string, string>;

  constructor(
    private http: HttpClient,
    @Inject(APICHECK_CONFIG) private config: ApiCheckConfig
  ) {
    this.headers = {
      Accept: 'application/json',
      'X-API-KEY': config.apiKey,
    };
    if (config.referer) {
      this.headers['Referer'] = config.referer;
    }
  }

  // Lookup API (NL, LU)
  lookup(country: string, postalcode: string, number: string | number): Observable<LookupResponse> {
    const c = country.toLowerCase();
    if (!LOOKUP_COUNTRIES.includes(c)) {
      return throwError(() => new Error(`Country '${country}' not supported for lookup`));
    }
    return this.http.get<LookupResponse>(`${API_ENDPOINT}/lookup/v1/address/`, {
      headers: this.headers,
      params: { country: c, postalcode, number: String(number) },
    });
  }

  getNumberAdditions(country: string, postalcode: string, number: string | number): Observable<NumberAdditionsResponse> {
    return this.http.get<NumberAdditionsResponse>(`${API_ENDPOINT}/lookup/v1/numberadditions/`, {
      headers: this.headers,
      params: { country: country.toLowerCase(), postalcode, number: String(number) },
    });
  }

  // Search API
  globalSearch(country: string, query: string, limit?: number): Observable<GlobalSearchResponse> {
    const c = country.toLowerCase();
    if (!SEARCH_COUNTRIES.includes(c)) {
      return throwError(() => new Error(`Country '${country}' not supported`));
    }
    const params: Record<string, string> = { country: c, query };
    if (limit) params['limit'] = String(limit);
    return this.http.get<GlobalSearchResponse>(`${API_ENDPOINT}/search/v1/global/`, {
      headers: this.headers,
      params,
    });
  }

  search(type: string, country: string, name: string, limit?: number): Observable<GlobalSearchResponse> {
    const params: Record<string, string> = { country: country.toLowerCase(), name };
    if (limit) params['limit'] = String(limit);
    return this.http.get<GlobalSearchResponse>(`${API_ENDPOINT}/search/v1/${type}/`, {
      headers: this.headers,
      params,
    });
  }

  // Verify API
  verifyEmail(email: string): Observable<EmailVerificationResponse> {
    return this.http.get<EmailVerificationResponse>(`${API_ENDPOINT}/verify/v1/email/`, {
      headers: this.headers,
      params: { email },
    });
  }

  verifyPhone(number: string): Observable<PhoneVerificationResponse> {
    return this.http.get<PhoneVerificationResponse>(`${API_ENDPOINT}/verify/v1/phone/`, {
      headers: this.headers,
      params: { number },
    });
  }
}

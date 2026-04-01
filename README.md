# @api-check/angular

Angular client for ApiCheck - address validation, search, and verification.

## Installation

```bash
npm install @api-check/angular
```

## Usage

### 1. Import the module

```typescript
import { ApiCheckModule } from '@api-check/angular';

@NgModule({
  imports: [
    ApiCheckModule.forRoot({
      apiKey: 'your-api-key',
      referer: 'https://yourdomain.com' // optional
    })
  ]
})
export class AppModule {}
```

### 2. Use the service

```typescript
import { Component } from '@angular/core';
import { ApiCheckService } from '@api-check/angular';

@Component({
  selector: 'app-root',
  template: `
    <input [(ngModel)]="postalcode" placeholder="Postal code">
    <input [(ngModel)]="number" placeholder="Number">
    <button (click)="lookup()">Lookup</button>
    
    <div *ngIf="address">
      {{ address.street }} {{ address.number }}<br>
      {{ address.postalcode }} {{ address.city }}
    </div>
  `
})
export class AppComponent {
  postalcode = '';
  number = '';
  address: any;

  constructor(private apiCheck: ApiCheckService) {}

  lookup() {
    this.apiCheck.lookup('nl', this.postalcode, this.number)
      .subscribe({
        next: (result) => this.address = result,
        error: (err) => console.error(err)
      });
  }
}
```

## API

### `lookup(country, postalcode, number)`
Address lookup (NL, LU). Returns `Observable<LookupResponse>`.

### `getNumberAdditions(country, postalcode, number)`
Get available number additions. Returns `Observable<NumberAdditionsResponse>`.

### `globalSearch(country, query, limit?)`
Global search across 18 countries. Returns `Observable<GlobalSearchResponse>`.

### `search(type, country, name, limit?)`
Search by type (city, street, postalcode, address). Returns `Observable<GlobalSearchResponse>`.

### `verifyEmail(email)`
Verify email address. Returns `Observable<EmailVerificationResponse>`.

### `verifyPhone(number)`
Verify phone number. Returns `Observable<PhoneVerificationResponse>`.

## License

MIT

## Support

- Website: [apicheck.nl](https://apicheck.nl)
- Email: support@apicheck.nl

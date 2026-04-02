# @api-check/angular

Angular service for ApiCheck - address validation, search, and verification for 18 European countries.

## Installation

```bash
npm install @api-check/angular
```

## Quick Start

```typescript
import { ApiCheckService } from '@api-check/angular';

// In your component or service
constructor(private apiCheck: ApiCheckService) {
  this.apiCheck.setApiKey('your-api-key');
}
```

## Global Search (Recommended)

The **global search** method is the most powerful way to find addresses. It searches across streets, cities, and postal codes in one query with powerful filtering options.

```typescript
// Basic search - finds streets, cities, and postal codes
this.apiCheck.globalSearch('nl', { query: 'Amsterdam', limit: 10 }).subscribe(results => {
  for (const result of results) {
    console.log(`${result.name} (${result.type})`);
  }
});
// Output:
// Amsterdam (city)
// Amsterdamsestraat (street)
// 1012LM (postalcode)

// Filter by city - only return results within a specific city
this.apiCheck.globalSearch('nl', { 
  query: 'Dam', 
  city_id: 2465, 
  limit: 10 
}).subscribe(results => { /* ... */ });

// Filter by street - only return results on a specific street  
this.apiCheck.globalSearch('nl', { 
  query: '1', 
  street_id: 12345, 
  limit: 10 
}).subscribe(results => { /* ... */ });

// Filter by postal code area
this.apiCheck.globalSearch('nl', { 
  query: 'A', 
  postalcode_id: 54321, 
  limit: 10 
}).subscribe(results => { /* ... */ });

// Belgium: filter by locality (deelgemeente)
this.apiCheck.globalSearch('be', { 
  query: 'Hoofd', 
  locality_id: 111, 
  limit: 10 
}).subscribe(results => { /* ... */ });

// Belgium: filter by municipality (gemeente)
this.apiCheck.globalSearch('be', { 
  query: 'Station', 
  municipality_id: 222, 
  limit: 10 
}).subscribe(results => { /* ... */ });
```

### Global Search Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `query` | string | Search term (street name, city name, or postal code) |
| `limit` | number | Maximum results (default: 10) |
| `city_id` | number | Filter results to a specific city |
| `street_id` | number | Filter results to a specific street |
| `postalcode_id` | number | Filter results to a specific postal code area |
| `locality_id` | number | Filter results to a specific locality (Belgium) |
| `municipality_id` | number | Filter results to a specific municipality (Belgium) |

### Result Types

Results include a `type` field indicating what was matched:

- `city` - City/municipality
- `street` - Street name
- `postalcode` - Postal code area

## Address Lookup (Netherlands & Luxembourg)

For exact address lookup by postal code and house number:

```typescript
// Basic lookup
this.apiCheck.lookup('nl', { 
  postalcode: '1012LM', 
  number: '1' 
}).subscribe(address => {
  console.log(address.street);  // Damrak
  console.log(address.city);    // Amsterdam
});

// With number addition (apartment/suite)
this.apiCheck.lookup('nl', { 
  postalcode: '1012LM', 
  number: '1',
  numberAddition: 'A'
}).subscribe(address => { /* ... */ });

// Get available number additions
this.apiCheck.getNumberAdditions('nl', '1012LM', '1').subscribe(additions => {
  console.log(additions.numberAdditions);  // ['A', 'B', '1-3']
});
```

## Individual Search Endpoints

```typescript
// Search cities
this.apiCheck.searchCity('nl', { name: 'Amsterdam', limit: 10 }).subscribe(/* ... */);

// Search streets
this.apiCheck.searchStreet('nl', { name: 'Damrak', limit: 10 }).subscribe(/* ... */);
this.apiCheck.searchStreet('nl', { name: 'Dam', city_id: 2465, limit: 10 }).subscribe(/* ... */);

// Search postal codes
this.apiCheck.searchPostalcode('nl', { name: '1012', limit: 10 }).subscribe(/* ... */);

// Search localities (Belgium primarily)
this.apiCheck.searchLocality('be', { name: 'Antwerpen', limit: 10 }).subscribe(/* ... */);

// Search municipalities (Belgium primarily)
this.apiCheck.searchMunicipality('be', { name: 'Antwerpen', limit: 10 }).subscribe(/* ... */);

// Resolve full address using IDs
this.apiCheck.searchAddress('nl', {
  city_id: 2465,
  number: '1',
  numberAddition: 'A',
  limit: 10
}).subscribe(/* ... */);
```

## Verification

```typescript
// Verify email
this.apiCheck.verifyEmail('test@example.com').subscribe(result => {
  console.log(result.status);          // valid, invalid, or unknown
  console.log(result.disposable_email); // true if disposable
  console.log(result.greylisted);       // true if greylisted
});

// Verify phone number
this.apiCheck.verifyPhone('+31612345678').subscribe(result => {
  console.log(result.valid);           // true if valid
  console.log(result.country_code);    // NL
});
```

## Supported Countries

### All Search Endpoints (18 countries)
`nl`, `be`, `lu`, `de`, `fr`, `cz`, `fi`, `it`, `no`, `pl`, `pt`, `ro`, `es`, `ch`, `at`, `dk`, `gb`, `se`

### Address Lookup (Netherlands & Luxembourg only)
`nl`, `lu`

## API Key

Get your API key at [app.apicheck.nl](https://app.apicheck.nl)

## Configuration

```typescript
// In your app module or component
this.apiCheck.setApiKey('your-api-key');

// Optional: Set referer if your API key has "Allowed Hosts" enabled
this.apiCheck.setReferer('https://yoursite.com');
```

## Tips

1. **Use Global Search first** - It's the most flexible and covers all use cases
2. **Filter for precision** - Use city_id, street_id, etc. to narrow down results
3. **Chain searches** - Use Search City to get a city_id, then use it in Global Search or Search Address
4. **Belgium addresses** - Use locality_id and municipality_id filters for precise results

## License

MIT

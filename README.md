# @api-check/angular

Angular service for ApiCheck - address validation, search, and verification for 18 European countries.

## Installation
npm install @api-check/angular

## Quick Start
import { ApiCheckService } from '@api-check/angular';

// In your component or service
constructor(private apiCheck: ApiCheckService) {
  this.apiCheck.setApiKey('your-api-key');
}

## Global Search (Recommended)
The **global search** method is the most powerful way to find addresses. It searches across streets, cities, and postal codes in one query with powerful filtering options.

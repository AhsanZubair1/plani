# Plans API Documentation

This document describes the comprehensive Plans API that matches the UI requirements shown in the Plans management interface.

## Base URL

```
/v1/plans
```

## Authentication

All endpoints require authentication. Include the authorization header:

```
Authorization: Bearer <your-token>
```

## Endpoints

### 1. Get Plans List (Main Table Data)

**GET** `/plans`

Retrieves a paginated list of plans with advanced filtering capabilities.

#### Query Parameters

| Parameter           | Type   | Description                  | Example                                     |
| ------------------- | ------ | ---------------------------- | ------------------------------------------- |
| `page`              | number | Page number (default: 1)     | `1`                                         |
| `limit`             | number | Items per page (default: 10) | `10`                                        |
| `planId`            | string | Filter by plan ID            | `DGU123456MR`                               |
| `tariff`            | string | Filter by tariff type        | `TOU`, `SR`, `GAS`                          |
| `planType`          | string | Filter by plan type          | `market`, `standing`                        |
| `customer`          | string | Filter by customer type      | `res`, `sme`                                |
| `state`             | string | Filter by state              | `VIC`, `NSW`                                |
| `distributor`       | string | Filter by distributor        | `Citipower`, `Multinet`                     |
| `effectiveDate`     | string | Filter by effective date     | `2024-12-12`                                |
| `uploadedDate`      | string | Filter by uploaded date      | `2024-12-01`                                |
| `assignedCampaigns` | string | Filter by assigned campaigns | `Market Offers July 2024`                   |
| `status`            | string | Filter by status             | `ready`, `incomplete`, `expired`            |
| `search`            | string | Global search term           | `Home Special`                              |
| `sortBy`            | string | Sort field                   | `plan_name`, `effective_from`, `created_at` |
| `sortOrder`         | string | Sort order                   | `ASC`, `DESC`                               |

#### Example Request

```bash
GET /v1/plans?page=1&limit=10&status=ready&tariff=TOU&state=VIC
```

#### Response

```json
{
  "data": [
    {
      "planId": 1,
      "planName": "Home Special",
      "intPlanCode": "HS001",
      "extPlanCode": "DGU123456MR",
      "effectiveFrom": "2024-12-12T00:00:00.000Z",
      "effectiveTo": "2025-12-12T00:00:00.000Z",
      "reviewDate": "2024-12-15T00:00:00.000Z",
      "restricted": false,
      "contingent": false,
      "directDebitOnly": false,
      "ebillingOnly": false,
      "solarCustOnly": false,
      "evOnly": false,
      "instrinctGreen": false,
      "eligibilityCriteria": "Residential customers only",
      "priceVariationDetails": "Standard pricing",
      "termsAndConditions": "Standard terms apply",
      "contractExpiryDetails": "12 month contract",
      "fixedRates": "Fixed rates for 12 months",
      "lowestRps": 25.5,
      "zoneId": 1,
      "planTypeId": 1,
      "customerTypeId": 1,
      "distributorId": 1,
      "rateCardId": 1,
      "contractTermId": 1,
      "billFreqId": 1,
      "createdAt": "2024-12-01T10:00:00.000Z",
      "updatedAt": "2024-12-01T10:00:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 1323,
    "totalPages": 133
  }
}
```

### 2. Plan Status Counts (Tab Counts)

**GET** `/plans/status/counts`

Returns the counts for Ready, Incomplete, and Expired plans (used for tab badges).

#### Response

```json
{
  "ready": 1323,
  "incomplete": 48,
  "expired": 4559
}
```

### 3. Individual Status Counts

**GET** `/plans/status/ready/count`
**GET** `/plans/status/incomplete/count`
**GET** `/plans/status/expired/count`

Returns individual status counts.

#### Response

```json
1323
```

### 4. Filter Options (Dropdown Data)

**GET** `/plans/filters/options`

Returns available filter options for dropdowns.

#### Response

```json
{
  "tariffs": ["TOU", "SR", "GAS", "FLAT"],
  "planTypes": ["market", "standing"],
  "customers": ["res", "sme"],
  "states": ["VIC", "NSW", "QLD", "SA", "WA", "TAS", "NT", "ACT"],
  "distributors": ["Citipower", "Multinet", "Powercor", "AusNet"]
}
```

### 5. Dashboard Summary

**GET** `/plans/dashboard/summary`

Returns comprehensive dashboard statistics.

#### Response

```json
{
  "totalPlans": 5930,
  "readyPlans": 1323,
  "incompletePlans": 48,
  "expiredPlans": 4559,
  "expiringSoon": 15,
  "recentUploads": 23
}
```

### 6. Expiring Soon Plans

**GET** `/plans/expiring-soon`

Returns plans expiring within the next 7 days.

#### Response

```json
[
  {
    "planId": 1,
    "planName": "Home Special",
    "effectiveTo": "2024-12-15T00:00:00.000Z"
    // ... other plan fields
  }
]
```

### 7. Recent Uploads

**GET** `/plans/recent-uploads`

Returns plans uploaded in the last 7 days.

#### Response

```json
[
  {
    "planId": 1,
    "planName": "New Plan",
    "createdAt": "2024-12-10T10:00:00.000Z"
    // ... other plan fields
  }
]
```

### 8. Search Suggestions

**GET** `/plans/search/suggestions?q=home&limit=10`

Returns search suggestions for plan names.

#### Response

```json
["Home Special", "Home Plus", "Home Premium", "Home Basic"]
```

### 9. Export Plans

**GET** `/plans/export`

Exports plans to CSV format with applied filters.

#### Query Parameters

Same as the main plans list endpoint.

#### Response

Returns a CSV file with the following columns:

- Plan ID
- Plan Name
- Internal Code
- External Code
- Tariff
- Plan Type
- Customer
- State
- Distributor
- Effective From
- Effective To
- Uploaded Date
- Status
- Assigned Campaigns

### 10. Bulk Operations

#### Bulk Delete

**POST** `/plans/bulk/delete`

```json
{
  "planIds": [1, 2, 3, 4, 5]
}
```

#### Bulk Update

**POST** `/plans/bulk/update`

```json
{
  "planIds": [1, 2, 3],
  "updates": {
    "restricted": true,
    "eligibilityCriteria": "Updated criteria"
  }
}
```

#### Response

```json
{
  "updated": 2,
  "failed": 1
}
```

### 11. Individual Plan Operations

#### Get Plan by ID

**GET** `/plans/:id`

#### Create Plan

**POST** `/plans`

#### Update Plan

**PATCH** `/plans/:id`

#### Delete Plan

**DELETE** `/plans/:id`

#### Soft Delete Plan

**PATCH** `/plans/:id/soft-delete`

#### Restore Plan

**PATCH** `/plans/:id/restore`

#### Get Plans by Rate Card

**GET** `/plans/rate-card/:rateCardId`

## Status Logic

### Ready Plans

- `effective_from <= now`
- `effective_to >= now`
- `restricted = false`

### Incomplete Plans

- Missing `plan_name` OR
- Missing `eligibility_criteria`

### Expired Plans

- `effective_to < now`

### Expiring Soon

- `effective_to` between now and 7 days from now

## Error Responses

### 400 Bad Request

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request"
}
```

### 404 Not Found

```json
{
  "statusCode": 404,
  "message": "Plan not found",
  "error": "Not Found"
}
```

### 500 Internal Server Error

```json
{
  "statusCode": 500,
  "message": "Internal server error",
  "error": "Internal Server Error"
}
```

## Rate Limiting

- 1000 requests per hour per user
- 100 requests per minute per user

## Caching

- Status counts are cached for 5 minutes
- Filter options are cached for 1 hour
- Dashboard summary is cached for 10 minutes

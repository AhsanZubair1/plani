# Plan Mapping API - Filtering and Search

## Overview

The Plan Mapping API provides comprehensive filtering and search functionality for plans, supporting all the filters shown in the UI interface.

## API Endpoint

```
GET /api/v1/plans/mapping
```

## Query Parameters

### Basic Filters

#### `planId` (string, optional)

- **Description**: Filter by plan ID
- **Example**: `?planId=DGU123456MR`
- **Search Type**: Partial match (ILIKE)

#### `distributor` (string, optional)

- **Description**: Filter by distributor name
- **Example**: `?distributor=Citipower`
- **Search Type**: Partial match (ILIKE)

#### `retailTariff` (string, optional)

- **Description**: Filter by retail tariff name
- **Example**: `?retailTariff=Single rate`
- **Search Type**: Partial match (ILIKE)

#### `customer` (string, optional)

- **Description**: Filter by customer type code
- **Example**: `?customer=RES`
- **Search Type**: Partial match (ILIKE)

### Price Filters

#### `minPrice` (number, optional)

- **Description**: Filter by minimum lowest possible price
- **Example**: `?minPrice=1000`

#### `maxPrice` (number, optional)

- **Description**: Filter by maximum lowest possible price
- **Example**: `?maxPrice=2000`

### Billing Code Filters

#### `billingCode` (string, optional)

- **Description**: Filter by billing code
- **Example**: `?billingCode=EVRMAY2025MR`
- **Search Type**: Partial match (ILIKE)

#### `billingCodeType` (string, optional)

- **Description**: Filter by billing code type
- **Example**: `?billingCodeType=PRODUCT`
- **Search Type**: Partial match (ILIKE)

### Search and Status

#### `search` (string, optional)

- **Description**: General search across multiple fields (plan ID, distributor, retail tariff, customer, billing codes)
- **Example**: `?search=DGU123`
- **Search Type**: Partial match across all relevant fields

#### `status` (enum, optional)

- **Description**: Filter by plan status
- **Options**: `ready`, `incomplete`, `expired`
- **Example**: `?status=ready`

### Pagination and Sorting

#### `page` (number, optional)

- **Description**: Page number for pagination
- **Default**: `1`
- **Example**: `?page=2`

#### `limit` (number, optional)

- **Description**: Number of items per page
- **Default**: `10`
- **Range**: 1-100
- **Example**: `?limit=20`

#### `sortBy` (string, optional)

- **Description**: Field to sort by
- **Options**: `planId`, `distributor`, `retailTariff`, `customer`, `lowestPossiblePrice`
- **Default**: `planId`
- **Example**: `?sortBy=distributor`

#### `sortOrder` (enum, optional)

- **Description**: Sort order
- **Options**: `ASC`, `DESC`
- **Default**: `ASC`
- **Example**: `?sortOrder=DESC`

## Response Format

```json
{
  "data": [
    {
      "planId": "DGU123456MR",
      "distributer": "Citipower",
      "retailTariffName": "Single rate",
      "customerType": "RES",
      "minimumChargeAmount": 1297,
      "billingCode": [
        {
          "code": "EVRMAY2025MR",
          "type": "PRODUCT",
          "typeName": "Product Code"
        },
        {
          "code": "OFFER001",
          "type": "OFFERING",
          "typeName": "Offering Code"
        }
      ]
    }
  ],
  "total": 1254,
  "page": 1,
  "limit": 10,
  "totalPages": 126
}
```

## Status Filtering Logic

### Ready Plans

- Plan status is 'PUBLISHED', 'PARKED', or NULL
- AND has required data (retail_tariff_id OR zone_id is not NULL)

### Incomplete Plans

- Plan status is 'PUBLISHED', 'PARKED', or NULL
- AND lacks required data (retail_tariff_id AND zone_id are both NULL)

### Expired Plans

- Plan status is 'EXPIRED'
- OR effective_to date is in the past

## Example API Calls

### Basic Filtering

```
GET /api/v1/plans/mapping?distributor=Citipower&customer=RES&limit=20
```

### Price Range Filtering

```
GET /api/v1/plans/mapping?minPrice=1000&maxPrice=2000
```

### Search Across Fields

```
GET /api/v1/plans/mapping?search=DGU123
```

### Status and Sorting

```
GET /api/v1/plans/mapping?status=ready&sortBy=lowestPossiblePrice&sortOrder=ASC
```

### Complex Filtering

```
GET /api/v1/plans/mapping?distributor=Citipower&customer=RES&minPrice=1000&status=ready&sortBy=planId&sortOrder=DESC&page=2&limit=25
```

### Billing Code Filtering

```
GET /api/v1/plans/mapping?billingCode=EVRMAY2025MR&billingCodeType=PRODUCT
```

## Status Counts Endpoint

```
GET /api/v1/plans/mapping/status/counts
```

Returns counts for each status:

```json
{
  "ready": 1254,
  "incomplete": 892,
  "expired": 4119
}
```

## Frontend Integration

### Filter Implementation

```typescript
const filters = {
  planId: 'DGU123456MR',
  distributor: 'Citipower',
  customer: 'RES',
  minPrice: 1000,
  maxPrice: 2000,
  status: 'ready',
};

const response = await fetch(
  `/api/v1/plans/mapping?${new URLSearchParams(filters)}`,
);
```

### Search Implementation

```typescript
const searchTerm = 'DGU123';
const response = await fetch(
  `/api/v1/plans/mapping?search=${encodeURIComponent(searchTerm)}`,
);
```

### Pagination Implementation

```typescript
const loadPage = async (page: number, limit: number = 10) => {
  const response = await fetch(
    `/api/v1/plans/mapping?page=${page}&limit=${limit}`,
  );
  const data = await response.json();
  return data;
};
```

## Performance Considerations

- All text searches use `ILIKE` for case-insensitive partial matching
- Proper indexing on filterable fields is recommended
- Pagination limits are enforced (max 100 items per page)
- Status filtering uses optimized queries with proper joins

## Error Handling

The API returns standard HTTP status codes:

- `200`: Success with data
- `400`: Bad request (invalid parameters)
- `500`: Internal server error

Invalid query parameters will be ignored (not cause errors), allowing for flexible frontend implementation.

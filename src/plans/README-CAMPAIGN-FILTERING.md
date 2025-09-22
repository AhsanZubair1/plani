# Campaign Filtering for Plans

## Overview

The plan list API now supports filtering campaigns linked to plans with the following features:

1. **Filter out expired campaigns by default** - Only active and future campaigns are shown
2. **Toggle to show expired campaigns** - Use `showExpiredCampaigns=true` parameter
3. **Limit number of campaigns displayed** - Use `campaignLimit` parameter (default: 5)
4. **"+X more" functionality** - The response includes information about additional campaigns

## API Endpoint

```
GET /api/v1/plans/list
```

## New Query Parameters

### `showExpiredCampaigns` (boolean, optional)

- **Default**: `false`
- **Description**: Include expired campaigns in the results
- **Example**: `?showExpiredCampaigns=true`

### `campaignLimit` (number, optional)

- **Default**: `5`
- **Description**: Maximum number of campaigns to display per plan
- **Example**: `?campaignLimit=3`

## Response Format

The response now includes both `effectiveTill` and `effectiveTo` fields for each plan:

### Active/Ready Plan Example

```json
{
  "data": [
    {
      "id": 1,
      "planName": "Residential Basic Plan",
      "planId": "PLAN001",
      "tariff": "TOU",
      "planType": "MARKET",
      "customer": "BUS",
      "state": "VIC",
      "distributor": "Citipower",
      "effectiveTill": "31/12/2024",
      "effectiveTo": "31/12/2025",
      "assignedCampaigns": "Summer Special, Winter Discount, Spring Promo",
      "assignedCampaignsWithStatus": [
        {
          "name": "Summer Special",
          "status": "ACTIVE"
        },
        {
          "name": "Winter Discount",
          "status": "ACTIVE"
        },
        {
          "name": "Spring Promo",
          "status": "FUTURE"
        }
      ],
      "planStatus": "ready",
      "isHighlighted": false
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10,
  "totalPages": 1
}
```

### Expired Plan Example

For expired plans, campaign information is excluded and `effectiveTill` shows the `effective_to` date:

```json
{
  "data": [
    {
      "id": 2,
      "planName": "Old Residential Plan",
      "planId": "PLAN002",
      "tariff": "TOU",
      "planType": "MARKET",
      "customer": "BUS",
      "state": "VIC",
      "distributor": "Citipower",
      "effectiveTill": "15/11/2024",
      "effectiveTo": "15/11/2024",
      "assignedCampaigns": "",
      "assignedCampaignsWithStatus": [],
      "planStatus": "EXPIRED",
      "isHighlighted": false
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10,
  "totalPages": 1
}
```

## Response Fields

- **`effectiveTill`**: Shows `effective_from` for active plans, `effective_to` for expired plans
- **`effectiveTo`**: Always shows the plan's `effective_to` date (or 'N/A' if null)
- **`assignedCampaigns`**: Comma-separated string of campaign names (empty for expired plans)
- **`assignedCampaignsWithStatus`**: Array of campaign objects with name and status (empty for expired plans)

## Plan Status Logic

### Plan Status Determination

- **EXPIRED**: Plan status is 'EXPIRED' OR `effective_to < now`
- **READY**: Plan has required data (retail_tariff_id or zone_id) and status is 'PUBLISHED', 'PARKED', or NULL
- **INCOMPLETE**: Plan lacks required data (retail_tariff_id and zone_id are both NULL) and status is 'PUBLISHED', 'PARKED', or NULL

### Campaign Information

- **For EXPIRED plans**: No campaign information is included (empty arrays and zero counts)
- **For non-EXPIRED plans**: Campaign information is processed normally

### Campaign Status Logic

Campaigns are categorized based on their effective dates:

- **ACTIVE**: `effective_from <= now` AND (`effective_to` is null OR `effective_to >= now`)
- **FUTURE**: `effective_from > now`
- **EXPIRED**: `effective_to < now`

## Frontend Implementation

### Show/Hide Expired Campaigns Toggle

```typescript
// Toggle expired campaigns
const toggleExpiredCampaigns = () => {
  setShowExpired(!showExpired);
  // Refetch data with new parameter
  fetchPlans({
    ...currentFilters,
    showExpiredCampaigns: !showExpired,
  });
};
```

### Display Campaign List with "+X more"

```typescript
const renderCampaigns = (plan) => {
  const { assignedCampaignsWithStatus, campaignSummary } = plan;

  return (
    <div>
      {assignedCampaignsWithStatus.map(campaign => (
        <span key={campaign.name} className={`badge ${getStatusClass(campaign.status)}`}>
          {campaign.name}
        </span>
      ))}

      {campaignSummary.hasMore && (
        <span className="badge badge-secondary">
          +{campaignSummary.moreCount} more
        </span>
      )}
    </div>
  );
};
```

### Adjust Campaign Limit

```typescript
// Show more campaigns per plan
const showMoreCampaigns = () => {
  fetchPlans({
    ...currentFilters,
    campaignLimit: 10,
  });
};
```

## Example API Calls

### Default behavior (exclude expired, limit to 5)

```
GET /api/v1/plans/list?page=1&limit=10
```

### Include expired campaigns

```
GET /api/v1/plans/list?showExpiredCampaigns=true&page=1&limit=10
```

### Show more campaigns per plan

```
GET /api/v1/plans/list?campaignLimit=10&page=1&limit=10
```

### Combined filters

```
GET /api/v1/plans/list?showExpiredCampaigns=true&campaignLimit=8&status=ready&page=1&limit=20
```

## Benefits

1. **Performance**: Limits the number of campaigns loaded and displayed
2. **User Experience**: Clean interface with "+X more" indicators
3. **Flexibility**: Toggle expired campaigns on/off as needed
4. **Scalability**: Handles plans with many campaigns efficiently
5. **Backward Compatibility**: Existing API calls continue to work

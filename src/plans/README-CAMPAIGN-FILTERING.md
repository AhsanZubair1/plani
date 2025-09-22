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

The response now includes a `campaignSummary` object for each plan:

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
      "campaignSummary": {
        "total": 8,
        "displayed": 3,
        "hasMore": true,
        "moreCount": 5,
        "showExpired": false
      },
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

## Campaign Summary Fields

- **`total`**: Total number of campaigns linked to this plan
- **`displayed`**: Number of campaigns currently displayed
- **`hasMore`**: Boolean indicating if there are more campaigns to show
- **`moreCount`**: Number of additional campaigns not displayed
- **`showExpired`**: Boolean indicating if expired campaigns are included

## Campaign Status Logic

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

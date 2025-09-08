# Loki and Grafana Logging Setup

This document describes the new logging infrastructure using Loki and Grafana instead of database logging.

## Overview

The application now uses:

- **Loki**: For log aggregation and storage
- **Grafana**: For log visualization and monitoring
- **Database logging**: Removed to reduce database load and improve performance

## Architecture

```
Local API Server → Loki Container → Grafana Container
     ↓                    ↓              ↓
  (npm start)        (Docker)       (Docker)
```

**Components:**

- **Local API Server**: Runs directly on your machine (not containerized)
- **Loki Container**: Docker container for log aggregation
- **Grafana Container**: Docker container for log visualization
- **External PostgreSQL**: Database running separately

## Services

### Loki

- **Port**: 3100
- **Purpose**: Log aggregation and storage
- **Configuration**: Uses default Loki configuration
- **Data**: Stores structured logs with labels and fields

### Grafana

- **Port**: 3001 (mapped from internal 3000)
- **Purpose**: Log visualization and monitoring
- **Default Credentials**: admin/admin
- **Dashboards**: Pre-configured API logs dashboard

## Log Structure

Logs are structured with the following labels:

- `job`: Always "api"
- `method`: HTTP method (GET, POST, etc.)
- `status_code`: HTTP status code
- `controller`: Controller name
- `action`: Action/method name
- `level`: Log level (info, warn, error)

Additional fields include:

- `url`: Request URL
- `user_id`: User ID (if authenticated)
- `ip_address`: Client IP address
- `user_agent`: User agent string
- `response_time_ms`: Response time in milliseconds
- `request_body`: Sanitized request body
- `response_body`: Sanitized response body
- `error_message`: Error message (for errors)

## Getting Started

1. **Ensure PostgreSQL is running**:

   - The application requires an external PostgreSQL database
   - Make sure your database is accessible and configured in your `.env` file

2. **Start Loki and Grafana services**:

   ```bash
   docker-compose up -d
   ```

3. **Start your API server**:

   ```bash
   npm run start:dev
   ```

4. **Access Grafana**:

   - URL: http://localhost:3001
   - Username: admin
   - Password: admin

5. **View Logs**:
   - Navigate to the "API Logs Dashboard"
   - Use the Logs panel to view recent API requests
   - Use other panels for metrics and analytics

## Configuration

### Environment Variables

Add to your `.env` file:

```env
LOKI_URL=http://loki:3100
```

### Grafana Data Source

The Loki data source is automatically configured via provisioning:

- File: `grafana/provisioning/datasources/loki.yml`
- URL: `http://loki:3100`

### Dashboards

Pre-configured dashboards are located in:

- `grafana/dashboards/api-logs-dashboard.json`

## Dashboard Features

The API Logs Dashboard includes:

1. **Request Rate**: Shows requests per second over time
2. **Response Time**: 95th percentile response time
3. **Status Code Distribution**: Pie chart of HTTP status codes
4. **HTTP Method Distribution**: Pie chart of HTTP methods
5. **Controller Distribution**: Pie chart of controller usage
6. **Recent Logs**: Live log stream with detailed information

## Log Queries

You can use LogQL to query logs in Grafana:

### Basic Queries

```logql
# All API logs
{job="api"}

# Error logs only
{job="api", level="error"}

# Specific status codes
{job="api", status_code="500"}

# Specific controller
{job="api", controller="AuthController"}
```

### Advanced Queries

```logql
# Rate of requests
rate({job="api"} [5m])

# Response time percentiles
quantile_over_time(0.95, {job="api"} | json | unwrap response_time_ms [5m])

# Count by status code
sum by (status_code) (count_over_time({job="api"} [1h]))
```

## Migration from Database Logging

The following changes were made:

1. **Removed**: Database logging infrastructure
2. **Added**: Loki service and client
3. **Updated**: Logging interceptor to use Loki
4. **Modified**: Logging service to format logs for Loki
5. **Created**: Grafana dashboards and configuration

### Backward Compatibility

Legacy methods in `LoggingService` still exist but return empty results:

- `getLogs()`
- `getLogById()`
- `getLogsByUserId()`
- `getLogsByStatusCode()`

These methods log warnings indicating that logs are now stored in Loki.

## Benefits

1. **Performance**: No database load from logging
2. **Scalability**: Loki handles high-volume log ingestion
3. **Visualization**: Rich dashboards and analytics
4. **Querying**: Powerful LogQL for log analysis
5. **Storage**: Efficient log storage and retention
6. **Monitoring**: Real-time log monitoring and alerting

## Troubleshooting

### Common Issues

1. **Loki not accessible**: Check if Loki container is running
2. **Grafana shows no data**: Verify Loki data source configuration
3. **Logs not appearing**: Check application logs for Loki connection errors

### Debugging

Enable debug logging in the application:

```typescript
// In logging.interceptor.ts
this.logger.debug('Logging to Loki:', logData);
```

### Health Checks

- Loki: http://localhost:3100/ready
- Grafana: http://localhost:3001/api/health

## Monitoring and Alerting

You can set up alerts in Grafana for:

- High error rates
- Slow response times
- Unusual traffic patterns
- System errors

## Retention and Storage

Loki configuration can be modified in `docker-compose.yaml` to adjust:

- Retention period
- Storage backend
- Compression settings
- Chunk settings

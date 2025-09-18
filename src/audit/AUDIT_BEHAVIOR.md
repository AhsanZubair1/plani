# Audit Logging Behavior Guide

## 🔍 **What Gets Logged by Default**

### **Database Operations Logged:**

- ✅ **CREATE** - New record insertions
- ✅ **UPDATE** - Record modifications
- ✅ **DELETE** - Record deletions
- ❌ **READ** - Record queries (disabled by default)
- ❌ **Raw SQL** - Direct SQL queries (disabled by default)
- ❌ **Bulk Operations** - Bulk inserts/updates/deletes (disabled by default)

### **API Operations Logged:**

- ✅ All HTTP requests (GET, POST, PUT, DELETE, etc.)
- ✅ Request/response data (configurable)
- ✅ User context and IP addresses
- ✅ Error responses and exceptions

## ⚙️ **Configuration Options**

### **Environment Variables:**

```bash
# Global audit control
AUDIT_ENABLED=true                    # Enable/disable audit logging
AUDIT_LOG_READS=false                 # Log database reads (VERBOSE!)
AUDIT_LOG_WRITES=true                 # Log database writes
AUDIT_LOG_DELETES=true                # Log database deletes
AUDIT_LOG_RAW_QUERIES=false           # Log raw SQL queries (VERBOSE!)
AUDIT_LOG_BULK_OPERATIONS=true        # Log bulk operations

# Performance settings
AUDIT_BATCH_SIZE=100                  # Batch size for bulk operations
AUDIT_ASYNC_LOGGING=true             # Use async logging
AUDIT_MAX_RETRIES=3                  # Retry failed audit logs

# Retention settings
AUDIT_RETENTION_DAYS=90              # Keep logs for 90 days
AUDIT_SENSITIVE_RETENTION_DAYS=365   # Keep sensitive data logs for 1 year
```

### **Sensitive Entities (Always Logged):**

These entities are always audited regardless of configuration:

- `users` - User accounts and profiles
- `audit_logs` - Audit log entries themselves
- `sessions` - User sessions
- `tokens` - Authentication tokens
- `plans` - Energy plans
- `campaigns` - Marketing campaigns
- `charges` - Billing charges
- `rates` - Pricing rates

### **Excluded Entities (Never Logged):**

These entities are never audited:

- `migrations` - Database migrations
- `migration_versions` - Migration version tracking
- `typeorm_metadata` - TypeORM metadata
- `temp_tables` - Temporary tables

## 📊 **Log Volume Estimates**

### **With Default Settings:**

- **Database Writes**: ~100-500 logs/day (depending on activity)
- **API Requests**: ~1000-5000 logs/day (depending on usage)
- **Total Storage**: ~10-50MB/day

### **With READ Logging Enabled:**

- **Database Reads**: ~10,000-50,000 logs/day (VERY HIGH!)
- **Total Storage**: ~500MB-2GB/day
- **Performance Impact**: Significant

## 🚨 **Performance Considerations**

### **High Volume Scenarios:**

1. **E-commerce sites**: High read/write volume
2. **Analytics dashboards**: Many queries
3. **Real-time applications**: Continuous data access

### **Recommended Settings for High Volume:**

```bash
AUDIT_ENABLED=true
AUDIT_LOG_READS=false          # Disable read logging
AUDIT_LOG_WRITES=true          # Keep write logging
AUDIT_LOG_DELETES=true         # Keep delete logging
AUDIT_BATCH_SIZE=500           # Increase batch size
AUDIT_ASYNC_LOGGING=true       # Use async logging
AUDIT_RETENTION_DAYS=30        # Shorter retention
```

### **Recommended Settings for Compliance:**

```bash
AUDIT_ENABLED=true
AUDIT_LOG_READS=true           # Enable read logging for compliance
AUDIT_LOG_WRITES=true
AUDIT_LOG_DELETES=true
AUDIT_RETENTION_DAYS=2555      # 7 years retention
AUDIT_SENSITIVE_RETENTION_DAYS=3650  # 10 years for sensitive data
```

## 🔧 **Customization Options**

### **1. Exclude Specific Entities:**

```typescript
// In audit.config.ts
excludedEntities: [
  'migrations',
  'migration_versions',
  'typeorm_metadata',
  'temp_tables',
  'your_entity_name',  // Add your entity here
],
```

### **2. Add Sensitive Entities:**

```typescript
// In audit.config.ts
sensitiveEntities: [
  'users',
  'audit_logs',
  'sessions',
  'tokens',
  'your_sensitive_entity',  // Add your entity here
],
```

### **3. Exclude Specific Fields:**

```typescript
// In audit.config.ts
excludedFields: [
  'password',
  'token',
  'secret',
  'key',
  'your_sensitive_field',  // Add your field here
],
```

## 📈 **Monitoring and Maintenance**

### **Health Checks:**

```bash
# Check audit log count
curl -H "Authorization: Bearer <token>" \
  http://localhost:3000/api/audit/stats

# Check storage usage
curl -H "Authorization: Bearer <token>" \
  "http://localhost:3000/api/audit/logs?limit=1"
```

### **Cleanup Operations:**

```bash
# Manual cleanup of old logs
curl -X POST -H "Authorization: Bearer <token>" \
  "http://localhost:3000/api/audit/cleanup?retentionDays=30"

# Export logs before cleanup
curl -X POST -H "Authorization: Bearer <token>" \
  "http://localhost:3000/api/audit/export?format=csv&startDate=2024-01-01&endDate=2024-12-31" \
  -o audit_logs_2024.csv
```

## 🛡️ **Security Considerations**

### **Data Protection:**

- Sensitive fields are automatically redacted
- Passwords, tokens, and keys are never logged
- IP addresses and user agents are logged for security
- All audit logs are immutable once created

### **Access Control:**

- Audit endpoints require JWT authentication
- Consider implementing role-based access for audit data
- Audit log access is itself audited

## 🔍 **Troubleshooting**

### **High Log Volume:**

1. Check if `AUDIT_LOG_READS=true` is set
2. Review excluded entities list
3. Consider increasing batch size
4. Enable async logging

### **Performance Issues:**

1. Disable read logging: `AUDIT_LOG_READS=false`
2. Increase batch size: `AUDIT_BATCH_SIZE=500`
3. Enable async logging: `AUDIT_ASYNC_LOGGING=true`
4. Reduce retention period: `AUDIT_RETENTION_DAYS=30`

### **Missing Logs:**

1. Check if audit is enabled: `AUDIT_ENABLED=true`
2. Verify entity is in auditable entities list
3. Check if entity is in excluded entities list
4. Review audit service logs for errors

## 📋 **Best Practices**

### **For Development:**

```bash
AUDIT_ENABLED=true
AUDIT_LOG_READS=false
AUDIT_LOG_WRITES=true
AUDIT_LOG_DELETES=true
AUDIT_RETENTION_DAYS=7
```

### **For Production:**

```bash
AUDIT_ENABLED=true
AUDIT_LOG_READS=false          # Unless compliance requires it
AUDIT_LOG_WRITES=true
AUDIT_LOG_DELETES=true
AUDIT_RETENTION_DAYS=90
AUDIT_ASYNC_LOGGING=true
```

### **For Compliance:**

```bash
AUDIT_ENABLED=true
AUDIT_LOG_READS=true           # Enable for compliance
AUDIT_LOG_WRITES=true
AUDIT_LOG_DELETES=true
AUDIT_RETENTION_DAYS=2555      # 7 years
AUDIT_SENSITIVE_RETENTION_DAYS=3650  # 10 years
```

## 🚀 **Getting Started**

1. **Copy environment variables:**

   ```bash
   cp audit.env.example .env
   ```

2. **Adjust settings for your needs:**

   ```bash
   # Edit .env file
   nano .env
   ```

3. **Import AuditModule in your app:**

   ```typescript
   import { AuditModule } from './audit/audit.module';

   @Module({
     imports: [AuditModule],
   })
   export class AppModule {}
   ```

4. **Monitor audit logs:**
   ```bash
   # Check audit statistics
   curl -H "Authorization: Bearer <token>" \
     http://localhost:3000/api/audit/stats
   ```

This audit system provides comprehensive logging while being configurable for different use cases and performance requirements.

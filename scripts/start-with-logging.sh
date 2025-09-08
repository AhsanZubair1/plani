#!/bin/bash

# Start Loki and Grafana for logging
echo "Starting Loki and Grafana for logging..."
echo "Note: Run your API server separately to connect to Loki"

# Check if .env file exists
if [ ! -f .env ]; then
    echo "Creating .env file from env-example-relational..."
    cp env-example-relational .env
fi

# Start Loki and Grafana services
echo "Starting Loki and Grafana services..."
docker-compose up -d

# Wait for services to be ready
echo "Waiting for services to start..."
sleep 10

# Check service health
echo "Checking service health..."

# Check Loki
if curl -s http://localhost:3100/ready > /dev/null; then
    echo "✅ Loki is ready"
else
    echo "❌ Loki is not responding"
fi

# Check Grafana
if curl -s http://localhost:3001/api/health > /dev/null; then
    echo "✅ Grafana is ready"
else
    echo "❌ Grafana is not responding"
fi

echo ""
echo "🚀 Loki and Grafana are ready!"
echo ""
echo "Access points:"
echo "  📊 Grafana Dashboard: http://localhost:3001 (admin/admin)"
echo "  🔍 Loki API: http://localhost:3100"
echo ""
echo "Next steps:"
echo "  1. Start your API server: ./scripts/start-api.sh"
echo "  2. Open Grafana at http://localhost:3001"
echo "  3. Login with admin/admin"
echo "  4. Navigate to 'API Logs Dashboard' to view logs"
echo "  5. Or go to 'Explore' to run custom LogQL queries"
echo ""
echo "To stop services:"
echo "  docker-compose down"

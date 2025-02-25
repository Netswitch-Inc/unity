#!/bin/bash

# Update MongoDB configuration to bind to 0.0.0.0
echo "Updating MongoDB configuration to bind to 0.0.0.0..."
CONFIG_FILE="/etc/mongod.conf"

if [ -f "$CONFIG_FILE" ]; then
  sed -i 's/^  bindIp:.*$/  bindIp: 0.0.0.0/' "$CONFIG_FILE"
else
  echo "MongoDB configuration file not found, creating a new one."
  cat > "$CONFIG_FILE" <<EOF
net:
  port: 27017
  bindIp: 0.0.0.0
EOF
fi

# Start MongoDB in the background
echo "Starting MongoDB..."
mongod --config "$CONFIG_FILE" --fork --logpath /var/log/mongod.log --pidfilepath /var/run/mongod.pid

# Wait for MongoDB to start
echo "Waiting for MongoDB to start..."
until mongo --eval "db.runCommand({ ping: 1 })" &>/dev/null; do
  sleep 1
done
mongo <<EOF
use unity
db.createUser({
  user: "unity",
  pwd: "Admin@123",
  roles: [ { role: "readWrite", db: "unity" } ]
})
EOF
# Ensure the dump file is in the correct structure
if [ -f "/dump/users.bson" ]; then
  mkdir -p /dump/database
  cd /dump
  mv * /dump/database/
fi

# Import the database dump
echo "Importing database dump..."
mongorestore --host localhost --port 27017 --username unity --password Admin@123 --authenticationDatabase unity --db unity /dump/database

echo "Database import completed successfully."

# Keep the container running
tail -f /var/log/mongod.log


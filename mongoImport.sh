#!/bin/bash
# MONGO_DB_DUMP_DIR="./dump/database"

set -e

# Load environment variables from .env file if available
if [ -f ./.env ]; then
  echo "Loading environment variables from .env file..."
  . ./.env
else
  echo "No .env file found, proceeding without it."
fi

#############################################
# Step 1: Check and Install MongoDB if Needed
#############################################
if ! which mongod > /dev/null 2>&1; then
  echo "MongoDB is not installed. Installing MongoDB Community Server..."

  # Install gnupg and curl
  sudo apt-get update
  sudo apt-get install -y gnupg curl

  # Import the public key and store it in /usr/share/keyrings/mongodb-server-6.0.gpg
  curl -fsSL https://www.mongodb.org/static/pgp/server-6.0.asc | \
    sudo gpg -o /usr/share/keyrings/mongodb-server-6.0.gpg --dearmor

  # Create the MongoDB list file (using "jammy" for Ubuntu 22.04; change if needed)
  echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-6.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | \
    sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

  # Reload the package database
  sudo apt-get update

  # Install MongoDB Community Server
  sudo apt-get install -y mongodb-org
else
  echo "MongoDB is already installed."
fi

#############################################
# Step 2: Init System and Start/Enable MongoDB
#############################################
echo "Init system: $(ps --no-headers -o comm 1)"

if ! systemctl is-active --quiet mongod; then
  echo "Starting MongoDB..."
  sudo systemctl start mongod
else
  echo "MongoDB is already running."
fi

if ! systemctl is-enabled --quiet mongod; then
  echo "Enabling MongoDB..."
  sudo systemctl enable mongod
else
  echo "MongoDB is already enabled."
fi

sudo systemctl restart mongod
sudo systemctl status mongod --no-pager


echo "⏳ Waiting for MongoDB to start..."
until mongosh --host "$MONGO_DB_HOST" --port "$MONGO_DB_PORT" --eval "db.runCommand({ ping: 1 })" --quiet; do
  sleep 2
done
echo "✅ MongoDB is up and running."

MONGO_DB_COLLECTION=modules

# Check and drop the collection if it exists before import
if [ -n "$MONGO_DB_COLLECTION" ]; then
  COLLECTION_EXISTS=$(mongosh --host "$MONGO_DB_HOST" --port "$MONGO_DB_PORT" --eval "db.getSiblingDB('$MONGO_DB_NAME').getCollectionNames().includes('$MONGO_DB_COLLECTION')" --quiet)
  
  if [ "$COLLECTION_EXISTS" = "true" ]; then
    echo "⚠️ Dropping existing collection: $MONGO_DB_COLLECTION"
    mongosh --host "$MONGO_DB_HOST" --port "$MONGO_DB_PORT" --eval "db.getSiblingDB('$MONGO_DB_NAME').$MONGO_DB_COLLECTION.drop()"
  else
    echo "✅ Collection $MONGO_DB_COLLECTION does not exist, skipping drop step."
  fi
fi

# Import the database dump
if [ -d "$MONGO_DB_DUMP_DIR" ]; then
  echo "🚀 Starting database import from $MONGO_DB_DUMP_DIR..."
 if [ "$MONGO_DB_SECURED" = true ]; then
    mongorestore --host "$MONGO_DB_HOST" --port "$MONGO_DB_PORT" \
      --username "$MONGO_DB_USER" --password "$MONGO_DB_PASSWORD" \
      --authenticationDatabase "$MONGO_DB_AUTH" --db "$MONGO_DB_NAME" "$MONGO_DB_DUMP_DIR"
  else
    mongorestore --host "$MONGO_DB_HOST" --port "$MONGO_DB_PORT" \
      --db "$MONGO_DB_NAME" "$MONGO_DB_DUMP_DIR"
  fi

  if [ $? -eq 0 ]; then
    echo "✅ Database import completed successfully."
  else
    echo "❌ Database import failed!"
  fi
else
  echo "❌ Dump directory $MONGO_DB_DUMP_DIR does not exist! Skipping database import."
fi

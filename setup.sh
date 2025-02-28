#!/bin/bash

# Install Docker and Docker Compose if not already installed
if ! command -v docker &> /dev/null
then
    echo "Docker not found. Installing Docker..."
    sudo apt install -y docker.io
    sudo systemctl start docker
    sudo systemctl enable docker
fi

if ! command -v docker-compose &> /dev/null
then
    echo "Docker Compose not found. Installing Docker Compose..."
    sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
fi

# Pull code and run docker-compose up --build -d
# Assuming your code is already in the current directory
echo "Running docker-compose up --build -d..."
docker-compose down && docker-compose up --build -d
# Update package list
sudo apt update

# Install Nginx and Certbot for Let's Encrypt SSL
sudo apt install nginx -y
# Start and enable Nginx
sudo systemctl start nginx
sudo systemctl enable nginx



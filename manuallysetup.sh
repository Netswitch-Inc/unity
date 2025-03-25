#!/bin/bash

# Install Docker and Docker Compose if not already installed
if ! [ -x "$(command -v docker)" ]; then
    echo "Docker not found. Installing Docker..."
    sudo apt install -y docker-ce
    sudo systemctl start docker
    sudo systemctl enable docker
else
    echo "Docker is already installed."
fi

if ! [ -x "$(command -v docker-compose)" ]; then
    # Fetch the latest version dynamically
    LATEST_VERSION=$(curl -s https://api.github.com/repos/docker/compose/releases/latest | grep -o '"tag_name": "v[0-9.]*"' | grep -o 'v[0-9.]*')
    
    # Install Docker Compose
    sudo curl -L "https://github.com/docker/compose/releases/download/${LATEST_VERSION}/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose

    echo "Docker Compose ${LATEST_VERSION} installed successfully."
else
    echo "Docker Compose is already installed."
fi

# Pull code and run docker-compose up --build -d
# Assuming your code is already in the current directory
echo "Running docker-compose up --build -d..."
docker-compose down && docker-compose up --build -d

echo "Docker setup complete!"

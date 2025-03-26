#!/bin/bash

# Start time
START_TIME=$(date +%s)

# Define Unity package root path (Update this path based on your actual directory)
UNITY_PACKAGE_ROOT_PATH="../unity-package"

# Set git repo branch name
GIT_BRANCH_NAME=master
#Example:
# v0.0.1 or v0.0.2

# Set environment variables
IP_ADDRESS="http://[Your_IP_Address]"
# Example:
# IP_ADDRESS="http://123.11.22.33"


FRONTEND_PORT=8081
BACKEND_PORT=3006

MONGO_DB_HOST=127.0.0.1
MONGO_DB_PORT=27017
MONGO_DB_NAME=unity
MONGO_DB_DUMP_DIR=./dump/database

# Secure database => https://www.digitalocean.com/community/tutorials/how-to-secure-mongodb-on-ubuntu-20-04
# Use mongosh if mongo not working
MONGO_DB_SECURED=false # Enable (true|false) if mongo database is secure
MONGO_DB_USER=""
MONGO_DB_PASSWORD=""
MONGO_DB_AUTH=""

COMPANY_NAME="[Company_Name]"
COMPANY_URL="[Company_Website_URL]"
# Example:
# COMPANY_NAME="Netswitch Inc."
# COMPANY_URL="https://netswitch.net"


# Function to print descriptions in color
print_yellow() {
    echo ""
    echo -e "\033[1;33m========================================================\033[0m"
    echo -e "\033[1;33m $1\033[0m"
    echo -e "\033[1;33m========================================================\033[0m"
}

print_green() {
    echo -e "\033[1;32m========================================================\033[0m"
    echo -e "\033[1;32m -- $1\033[0m"
    echo -e "\033[1;32m========================================================\033[0m"
}

print_red() {
    echo -e "\033[1;31m========================================================\033[0m"
    echo -e "\033[1;31m $1\033[0m"
    echo -e "\033[1;31m========================================================\033[0m"
}

# Function to check for errors and exit
handle_error() {
  local message="$1"
  print_red "$message"
  exit 1 # Exit with a non-zero code indicating failure.
}


# Checking if Git is installed
print_yellow "Checking if Git is installed..."
if ! [ -x "$(command -v git)" ]; then
    print_green "Git is not installed. Installing Git..."
    sudo apt update -y || handle_error "Failed to update apt package list."
    sudo apt install -y git || handle_error "Failed to install Git."
    print_green "Git installation completed successfully."
else
    print_green "Git is already installed."
fi

# Check for .git directory
print_yellow "Check for .git directory"
if [ ! -d ".git" ]; then
    print_green "No .git directory found. Resetting the repository..."
    sudo rm -rf -- .[^.] || handle_error "Failed to remove existing files/directories."
    git init || handle_error "Failed to initialize Git repository."
    git remote add origin https://github.com/Netswitch-Inc/unity.git || handle_error "Failed to add remote origin."
fi

# Fetching the latest repository changes
print_yellow "Fetching the latest repository changes"
git fetch --depth=1 origin ${GIT_BRANCH_NAME} || handle_error "Failed to fetch from remote repository."
git reset --hard origin/${GIT_BRANCH_NAME} || handle_error "Failed to reset to origin/${GIT_BRANCH_NAME}."

# Set 777 permission for Unity package root path
print_yellow "Setting 0777 permissions for Unity package directory..."
if [ -d "$UNITY_PACKAGE_ROOT_PATH" ]; then
    sudo chmod -R 0777 "$UNITY_PACKAGE_ROOT_PATH" || handle_error "Failed to set permissions on Unity package directory."
    print_green "Permissions set successfully."
else
    handle_error "Unity package root path does not exist: $UNITY_PACKAGE_ROOT_PATH"
fi

# Set environment variables dynamically
print_yellow "Set environment variables dynamically"
export FRONTEND_PORT=$FRONTEND_PORT
export BACKEND_PORT=$BACKEND_PORT
export MONGO_DB_HOST=$MONGO_DB_HOST
export MONGO_DB_PORT=$MONGO_DB_PORT
export MONGO_DB_NAME=$MONGO_DB_NAME
export MONGO_DB_DUMP_DIR=$MONGO_DB_DUMP_DIR

export MONGO_DB_SECURED=$MONGO_DB_SECURED # Enable (true|false) if mongo database is secure
export MONGO_DB_USER=$MONGO_DB_USER
export MONGO_DB_PASSWORD=$MONGO_DB_PASSWORD
export MONGO_DB_AUTH=$MONGO_DB_AUTH

# Construct full API URLs
FRONTEND_WEB_URL="${IP_ADDRESS}:${FRONTEND_PORT}"
BACKEND_API_URL="${IP_ADDRESS}:${BACKEND_PORT}"

# Define variables
ROOT_ENV_FILE="./.env"
BACKEND_ENV_FILE="./backend/.env"
FRONTEND_ENV_FILE="./frontend/.env"

# Function to update .env files
update_environment_file() {
    local env_file=$1
    local key=$2
    local value=$3

    # Check if .env file exists, create if not
    if [ ! -f "$env_file" ]; then
        touch "$env_file" || handle_error "Failed to create $env_file."
    fi

    # If key exists, update it; otherwise, append it
    if grep -q "^$key=" "$env_file"; then
        sed -i "s|^$key=.*|$key=$value|" "$env_file" || handle_error "Failed to update $key in $env_file."
    else
        echo "$key=$value" >> "$env_file" || handle_error "Failed to append $key to $env_file."
    fi
}

# Update backend .env
print_yellow "Updating root .env file..."
update_environment_file "$ROOT_ENV_FILE" "FRONTEND_PORT" "$FRONTEND_PORT"
update_environment_file "$ROOT_ENV_FILE" "BACKEND_PORT" "$BACKEND_PORT"
update_environment_file "$ROOT_ENV_FILE" "MONGO_DB_HOST" "$MONGO_DB_HOST"
update_environment_file "$ROOT_ENV_FILE" "MONGO_DB_PORT" "$MONGO_DB_PORT"
update_environment_file "$ROOT_ENV_FILE" "MONGO_DB_NAME" "$MONGO_DB_NAME"
update_environment_file "$ROOT_ENV_FILE" "MONGO_DB_DUMP_DIR" "$MONGO_DB_DUMP_DIR"
update_environment_file "$ROOT_ENV_FILE" "MONGO_DB_SECURED" "$MONGO_DB_SECURED"
update_environment_file "$ROOT_ENV_FILE" "MONGO_DB_USER" "$MONGO_DB_USER"
update_environment_file "$ROOT_ENV_FILE" "MONGO_DB_PASSWORD" "$MONGO_DB_PASSWORD"
update_environment_file "$ROOT_ENV_FILE" "MONGO_DB_AUTH" "$MONGO_DB_AUTH"

print_yellow "Updating backend .env file..."
update_environment_file "$BACKEND_ENV_FILE" "FRONT_WEB_URL" "$FRONTEND_WEB_URL"
update_environment_file "$BACKEND_ENV_FILE" "PORT" "$BACKEND_PORT"
if [ "$MONGO_DB_SECURED" = true ]; then
    update_environment_file "$BACKEND_ENV_FILE" "APP_MODE" "production"
else
    update_environment_file "$BACKEND_ENV_FILE" "APP_MODE" "development"
fi
update_environment_file "$BACKEND_ENV_FILE" "DATABASE_NAME" "$MONGO_DB_NAME"
update_environment_file "$BACKEND_ENV_FILE" "DB_PORT" "$MONGO_DB_PORT"
update_environment_file "$BACKEND_ENV_FILE" "MONGO_DB_USER" "$DATABASE_USER"
update_environment_file "$BACKEND_ENV_FILE" "DATABASE_PASSWORD" "$MONGO_DB_PASSWORD"
update_environment_file "$BACKEND_ENV_FILE" "DATABASE_AUTH" "$MONGO_DB_AUTH"
update_environment_file "$BACKEND_ENV_FILE" "BACK_UNITY_URL" "$BACKEND_API_URL"

# Update frontend .env
print_yellow "Updating frontend .env file..."
update_environment_file "$FRONTEND_ENV_FILE" "REACT_APP_BACKEND_REST_API_URL" "$BACKEND_API_URL"
update_environment_file "$FRONTEND_ENV_FILE" "PORT" "$FRONTEND_PORT"
update_environment_file "$FRONTEND_ENV_FILE" "REACT_APP_COMPANY_NAME" "$COMPANY_NAME"
update_environment_file "$FRONTEND_ENV_FILE" "REACT_APP_COMPANY_URL" "$COMPANY_URL"

print_green  "Updated .env files successfully."

print_yellow "Executing database import script..."
if [ -f ./mongoImport.sh ]; then
  . ./mongoImport.sh
else
  print_yellow "No mongoImport.sh file found, proceeding without it."
fi

# Check and install NGINX
print_yellow "Check is NGINX installed."
if which nginx > /dev/null 2>&1; then
    print_green "NGINX is already installed."
else
    print_green "NGINX is not install, now install NGINX"
    # Update package list
    sudo apt update -y || handle_error "Failed to update apt package list for Nginx installation."

    # Install NGINX
    sudo apt install -y nginx || handle_error "Failed to install Nginx."

    # Enable and start NGINX service
    sudo systemctl enable nginx || handle_error "Failed to enable Nginx service."
    sudo systemctl start nginx || handle_error "Failed to start Nginx service."

    print_green "NGINX installation completed successfully."
fi

# Check if NGINX is running
print_yellow "Check if NGINX is running"
if systemctl is-active --quiet nginx; then
    print_green "NGINX is running."
else
    print_green "NGINX is NOT running. Restarting..."
    sudo systemctl restart nginx || handle_error "Failed to restart Nginx service."
    print_green "NGINX restarted."
fi


# Install Docker and Docker Compose if they are not already installed.
print_yellow "Install Docker and Docker Compose if they are not already installed."
if ! [ -x "$(command -v docker)" ]; then

    # Update package list and install dependencies
    sudo apt update || handle_error "Failed to update apt package list for Docker installation."
    sudo apt install -y ca-certificates curl gnupg || handle_error "Failed to install dependencies for Docker."

    # Add Docker's official GPG key
    sudo install -m 0755 -d /etc/apt/keyrings || handle_error "Failed to create directory for Docker GPG key."
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo tee /etc/apt/keyrings/docker.asc > /dev/null || handle_error "Failed to download and save Docker GPG key."
    sudo chmod a+r /etc/apt/keyrings/docker.asc || handle_error "Failed to set permissions on Docker GPG key."

    # Set up the Docker repository
    echo "deb [signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null || handle_error "Failed to add Docker repository."

    # Update package list again
    sudo apt update || handle_error "Failed to update apt package list after adding Docker repository."

    # Install Docker
    sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin || handle_error "Failed to install Docker packages."

    # Start and enable Docker service
    sudo systemctl start docker || handle_error "Failed to start Docker service."
    sudo systemctl enable docker || handle_error "Failed to enable Docker service."

    print_green "Docker installed successfully!"
else
    print_green "Docker is already installed."
fi

# Ensure Docker service is running
print_yellow "Ensure Docker service is running"
if ! systemctl is-active --quiet docker; then
    print_green "Docker service is not running. Starting Docker..."
    sudo systemctl start docker || handle_error "Failed to start Docker service."
    print_green "Docker started."
else
    print_green "Docker service is already running."
fi

print_yellow "Install Docker Compose"
if ! [ -x "$(command -v docker-compose)" ]; then
    # Fetch the latest version dynamically
    LATEST_VERSION=$(curl -s https://api.github.com/repos/docker/compose/releases/latest | grep -o '"tag_name": "v[0-9.]*"' | grep -o 'v[0-9.]*')

    # Install Docker Compose
    sudo curl -L "https://github.com/docker/compose/releases/download/${LATEST_VERSION}/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose || handle_error "Failed to download Docker Compose."
    sudo chmod +x /usr/local/bin/docker-compose || handle_error "Failed to set permissions on Docker Compose."

    print_green "Docker Compose ${LATEST_VERSION} installed successfully."
else
    print_green "Docker Compose is already installed."
fi

# Pull code and run docker-compose up --build -d
# Assuming your code is already in the current directory
print_yellow "Running docker-compose up --build -d..."
sudo docker-compose down && sudo docker-compose up --build -d

# End time
END_TIME=$(date +%s)

# Calculate elapsed time
ELAPSED_TIME=$(($END_TIME - $START_TIME))
HOURS=$(($ELAPSED_TIME / 3600))
MINUTES=$((($ELAPSED_TIME % 3600) / 60))
SECONDS=$(($ELAPSED_TIME % 60))
echo ""
print_yellow "Installation completed!"
echo ""
print_yellow "Total execution time: ${HOURS} hours, ${MINUTES} minutes, and ${SECONDS} seconds."
echo ""
print_yellow "Access the Unity portal at $FRONTEND_WEB_URL"


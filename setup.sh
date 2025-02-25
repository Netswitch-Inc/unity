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

# Request domain names from the user for the two vhosts
# read -p "Enter the domain name for the first vhost (e.g., example1.com): " DOMAIN_1
# read -p "Enter the domain name for the second vhost (e.g., example2.com): " DOMAIN_2

# Create the Nginx configuration for the first vhost (reverse proxy for port 3006)
# cat <<EOF | sudo tee /etc/nginx/sites-available/$DOMAIN_1
# server {
#     listen 80;
#     server_name $DOMAIN_1;

#     location / {
#         proxy_pass http://localhost:3006;
#         proxy_set_header Host \$host;
#         proxy_set_header X-Real-IP \$remote_addr;
#         proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
#         proxy_set_header X-Forwarded-Proto \$scheme;
#     }
# }

# EOF

# Create the Nginx configuration for the second vhost (reverse proxy for port 8081)
# cat <<EOF | sudo tee /etc/nginx/sites-available/$DOMAIN_2
# server {
#     listen 80;
#     server_name $DOMAIN_2;

#     location / {
#         proxy_pass http://localhost:8081;
#         proxy_set_header Host \$host;
#         proxy_set_header X-Real-IP \$remote_addr;
#         proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
#         proxy_set_header X-Forwarded-Proto \$scheme;
#     }
# }
# EOF

# Enable the new sites by creating symbolic links
# sudo ln -s /etc/nginx/sites-available/$DOMAIN_1 /etc/nginx/sites-enabled/
# sudo ln -s /etc/nginx/sites-available/$DOMAIN_2 /etc/nginx/sites-enabled/

# Test the Nginx configuration for syntax errors
# sudo nginx -t

# Restart Nginx to apply the changes
# sudo systemctl restart nginx
# sudo snap install --classic certbot
# sudo ln -s /snap/bin/certbot /usr/bin/certbot
# Request SSL certificates for both domains using Certbot (Let's Encrypt)
# sudo certbot --nginx -d $DOMAIN_1 -d $DOMAIN_1
# sudo certbot renew --dry-run


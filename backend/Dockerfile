# Base image
FROM ubuntu:latest AS development

# Update and install dependencies
RUN apt update && apt-get update && apt-get install -y \
    wget \
    gnupg2 \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Google Chrome (for Puppeteer or other headless tasks)
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - && \
    sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' && \
    apt-get update && apt-get install -y google-chrome-stable && \
    rm -rf /var/lib/apt/lists/*

# Confirm installation
RUN google-chrome-stable --version

# Install Node.js 16
RUN curl -sL https://deb.nodesource.com/setup_16.x -o nodesource_setup.sh && \
    bash nodesource_setup.sh && \
    apt-get install -y nodejs

# Set working directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy application code
COPY . .

# Expose application port
EXPOSE 3306

# ✅ Increase Node.js heap memory to 6GB
ENV NODE_OPTIONS="--max-old-space-size=6144"

# Start the app
CMD ["npm", "start"]

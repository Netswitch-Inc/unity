FROM ubuntu:latest AS development
RUN apt update 

RUN apt-get update && apt-get install -y \
    wget \
    gnupg2 \
    && rm -rf /var/lib/apt/lists/*

# Install Chromium
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
RUN sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list'
RUN apt-get update && apt-get install -y \
    google-chrome-stable \
    && rm -rf /var/lib/apt/lists/*

# Confirm installation
RUN google-chrome-stable --version

# Install Node.js 16
RUN apt-get update \
    && apt-get install -y curl \
    && curl -sL https://deb.nodesource.com/setup_16.x -o nodesource_setup.sh 
RUN bash nodesource_setup.sh
RUN apt-get install nodejs -y 
#RUN apt-get install -y npm
WORKDIR /usr/src/app

COPY package*.json ./
# Install Node.js dependencies

RUN npm install
COPY . .
EXPOSE 3306
CMD ["npm", "start"]

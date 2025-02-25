# Use Node.js base image for frontend
FROM node:16-alpine AS development

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package.json ./
RUN npm install --legacy-peer-deps 
RUN mkdir -p /usr/src/app/node_modules/.cache && \
    chmod -R 777 /usr/src/app/node_modules/.cache
# Copy the application source code
COPY . .

# Expose port and run the app
EXPOSE 8081
CMD ["npm", "start"]


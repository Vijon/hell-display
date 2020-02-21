# Base on offical Node.js Alpine image
FROM node:alpine

# Set working directory
WORKDIR /usr/app

# Ready to serve static folder
RUN npm install --global serve

# Copy package.json and package-lock.json before other files
# Utilise Docker cache to save re-installing dependencies if unchanged
COPY ./package*.json ./

# Install dependencies
RUN npm install

# Copy all files
COPY ./ ./

# Build app
RUN npm run build

# Run npm start script with PM2 when container starts
CMD [ "npx", "serve", "build", "--listen", "80" ]
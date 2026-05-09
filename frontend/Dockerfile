# Use Node.js LTS image
FROM node:20-slim

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the application source code
COPY . .

# Expose the port for the Next.js app
EXPOSE 3001

# Start the Next.js app
CMD ["npm", "run", "dev"]

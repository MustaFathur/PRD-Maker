# Use the required Node version
FROM node:22

# Set the working directory
WORKDIR /app

# Copy the necessary files
COPY package*.json ./
COPY . .

# Install dependencies
RUN npm install

# Expose the port that Cloud Run expects
EXPOSE 8080

# Run the application
CMD ["npm", "start"]
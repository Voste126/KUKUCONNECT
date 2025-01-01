# Use an official node runtime as a parent image
FROM node:lts-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose port 5173 (default Vite port)
EXPOSE 5173

# Command to run the application
CMD ["npm", "run", "dev", "--", "--host"]

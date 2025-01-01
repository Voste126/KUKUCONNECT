# # Use an official node runtime as a parent image
# FROM node:lts-alpine

# # Set the working directory in the container
# WORKDIR /app

# # Copy package.json and package-lock.json
# COPY package.json package-lock.json ./

# # Install dependencies
# RUN npm install

# # Copy the rest of the application code
# COPY . .

# # Expose port 5173 (default Vite port)
# EXPOSE 5173


# # Command to run the application
# CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# Use an official Node.js runtime as a base image
FROM node:lts-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json for dependency installation
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the application code
COPY . .

# Build the application (Vite production build)
RUN npm run build

# Expose the port Render will use
EXPOSE 3000

# Set the environment variable for the server to use Render's PORT
ENV PORT=3000

# Command to start the production server
CMD ["npm", "run", "preview", "--", "--port", "3000", "--host"]



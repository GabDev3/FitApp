# Use official Node image
FROM node:18

# Set working directory inside the container
WORKDIR /app

# Copy only package.json and lock file first (for caching deps)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your app
COPY . .

# Set host to 0.0.0.0 so it works inside Docker
ENV HOST=0.0.0.0

# Expose Vite's default port
EXPOSE 5173

# Run Vite dev server
CMD ["npm", "run", "dev"]

# 1. Use the official Node.js 20 LTS Alpine image for minimal size and security
FROM node:20-alpine

# 2. Set the working directory inside the container
WORKDIR /app

# 3. Copy package manifests first to leverage Docker layer caching
COPY package*.json ./

# 4. Install production dependencies
RUN npm install --omit=dev

# 5. Copy the rest of the application source code
COPY . .

# 6. Expose the port the server listens on
EXPOSE 3000

# 7. Start the server
CMD ["node", "server.js"]

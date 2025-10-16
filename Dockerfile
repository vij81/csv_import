# Step 1: Use an official Node.js base image
FROM node:18-alpine

# Step 2: Set working directory inside the container
WORKDIR /app

# Step 3: Copy package.json and package-lock.json first
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install --production

# Step 5: Copy all source code into the container
COPY . .

# Step 6: Make sure uploads folder exists (for multer)
RUN mkdir -p uploads

# Step 7: Expose the port your app runs on
EXPOSE 8000

# Step 8: Command to run your backend
CMD ["node", "server.js"]

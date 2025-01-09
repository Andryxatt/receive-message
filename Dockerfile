# # Use the official Node.js 18 image as a base
FROM node:18

# Set the working directory in the container
WORKDIR /usr/src

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the app dependencies
RUN npm install

# Install nodemon globally
RUN npm install -g nodemon ts-node typescript

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port that the app runs on
EXPOSE 3001

# Define the command to run the app in development mode
CMD ["nodemon", "--watch", ".", "--ignore", "node_modules", "--exec", "npm", "run", "dev"]

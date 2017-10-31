FROM node:8.1.2

RUN apt-get update && \
    apt-get install -y libcairo2-dev libjpeg62-turbo-dev libpango1.0-dev \
    libgif-dev build-essential g++

# Create a directory where our app will be placed
RUN mkdir -p /workdir

# Change directory so that our commands run inside this new dir
WORKDIR /workdir

# Copy dependency definitions
COPY package.json /workdir

# Install dependecies
RUN npm install

# Expose the port the app runs in
EXPOSE 80

# Serve the app
CMD ["npm", "start"]

FROM node:18-alpine

# Install system dependencies
RUN apk add --no-cache \
    bash \
    curl \
    jq \
    openssl \
    python3 \
    py3-pip \
    make \
    g++ \
    linux-headers

# Install Vault CLI
RUN wget -O vault.zip https://releases.hashicorp.com/vault/1.15.2/vault_1.15.2_linux_amd64.zip && \
    unzip vault.zip && \
    mv vault /usr/local/bin/ && \
    rm vault.zip

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy application code
COPY . .

# Expose port
EXPOSE 3020

# Start the application
CMD ["npm", "start"]

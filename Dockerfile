# ---------- Frontend build stage ----------
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* pnpm-lock.yaml* ./
RUN if [ -f pnpm-lock.yaml ]; then npm i -g pnpm && pnpm install --no-frozen-lockfile; \
    else npm install; fi

# Copy sources and build web assets
COPY . .
RUN npm run web:build

# ---------- Production stage ----------
FROM nginx:alpine AS production

# Copy built SPA to Nginx html dir
COPY --from=builder /app/web/dist /usr/share/nginx/html

# Replace default nginx config to support HTML5 history mode
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"] 
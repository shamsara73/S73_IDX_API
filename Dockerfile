FROM denoland/deno:2.9.0

WORKDIR /app

COPY . .

# Pre-fetch the full dependency graph (jsr: + npm: packages) into the image cache
RUN deno cache src/api/Server.ts

EXPOSE 52060

# serve task in the repo lacks --allow-env (PORT lookup) — use -A
CMD ["deno", "run", "-A", "src/api/Server.ts"]

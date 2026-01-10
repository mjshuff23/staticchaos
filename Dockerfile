FROM debian:bookworm-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
    bash \
    build-essential \
    ca-certificates \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /opt/staticchaos
COPY . .

RUN chmod +x scripts/run-env.sh scripts/run-dev.sh scripts/run-prod.sh \
  && make -C src chaosium

EXPOSE 4000 5000

ENTRYPOINT ["./scripts/run-env.sh"]
CMD ["dev", "4000"]

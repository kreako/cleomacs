#!/bin/sh

podman run -d \
  --restart=always \
  -e POSTGRES_PASSWORD="password" \
  -v ./pgdata/:/var/lib/postgresql/data:z \
  --name cleomacs-db \
  -p 5432:5432 \
  postgres

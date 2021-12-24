#!/bin/sh

podman ps | grep cleomacs-db > /dev/null

if [ $? -eq 1 ]; then
  podman run -d \
    --restart=always \
    -e POSTGRES_PASSWORD="password" \
    -v ./pgdata/:/var/lib/postgresql/data:z \
    --name cleomacs-db \
    -p 5432:5432 \
    postgres
  echo "postgres launched !"
else
  echo "postgres already running"
fi
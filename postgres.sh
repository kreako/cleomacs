#!/bin/sh

podman ps | grep cleomacs-db > /dev/null

if [ $? -eq 1 ]; then
  # postgres not running
  # Maybe this need to be restarted
  podman ps -a | grep cleomacs-db > /dev/null
  if [ $? -eq 1 ]; then
    # No, need to run
    podman run -d \
      --restart=always \
      -e POSTGRES_PASSWORD="password" \
      -v ./pgdata/:/var/lib/postgresql/data:z \
      --name cleomacs-db \
      -p 5432:5432 \
      postgres
    echo "postgres launched !"
  else
    podman start cleomacs-db
    echo "postgres started !"
  fi
else
  echo "postgres already running"
fi
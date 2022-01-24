#!/bin/sh

podman ps | grep cleomacs-redis > /dev/null

if [ $? -eq 1 ]; then
  # redis not running
  # Maybe this need to be restarted
  podman ps -a | grep cleomacs-redis > /dev/null
  if [ $? -eq 1 ]; then
    # No, need to run
    podman run -d \
      --restart=always \
      --name cleomacs-redis \
      -p 6379:6379 \
      redis
    echo "redis launched !"
  else
    podman start cleomacs-redis
    echo "redis started !"
  fi
else
  echo "redis already running"
fi
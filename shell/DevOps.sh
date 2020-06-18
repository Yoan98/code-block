#!/bin/bash
#删除已有的同名镜像
docker rmi `docker images -q --filter reference=${img_name}`

#构建web镜像
docker build -t ${img_name}:${tag} .

#解决掉重复容器问题
RUNNING=$(docker inspect --format="{{ .State.Running }}" ${container_name})

if [ ! ${RUNNING} ]; then
  echo "${container_name} is not running"
else
  echo "${container_name} is running"

  stopConId=$(docker ps --filter="name=${container_name}" -q | xargs)
  if [-n ${stopConId}]; then
    docker stop ${containerId}
  fi

  removeConId=$(docker ps -a -filter="name=${container_name}" -q | xargs)
  if [ -n ${removeConId} ]; then
    docker rm ${removeConId}
  fi
fi
echo "${container_name} is ${RUNNING}"
#启动容器
docker run --name ${container_name} -itd -p ${port}:80 ${img_name}:${tag}

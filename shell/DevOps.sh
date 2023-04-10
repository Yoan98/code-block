#!/bin/bash
img_name='nset'
container_name='nest'
hostPort=3001
env=$1

echo "current enviornment ${env}"

if [ -z "${env}" ]; then
  echo "please input enviornment"
  exit 1
fi

# #停止重复的容器
stopConId=$(docker ps --filter="name=${container_name}" -q | xargs)
if [ -n "${stopConId}" ]; then
  echo "stop container start"
  docker stop "${stopConId}"
  echo "stop container end"
fi

# 删除重复容器
removeConId=$(docker ps -a --filter="name=${container_name}" -q | xargs)
if [ -n "${removeConId}" ]; then
  echo "remove container start"
  docker rm "${removeConId}"
  echo "remove container end"
fi

#删除已有的同名镜像
imgId=$(docker images -q --filter reference=${img_name})
if [ -n "${imgId}" ]; then
  echo "remove image start"
  docker image rm "${imgId}"
  echo "remove image end"
fi

#构建web镜像
echo "build images start"
docker build -t ${img_name} .
echo "build images end"

#启动容器
echo "run container start"
docker run --env NODE_ENV="${env}" --rm --name ${container_name} -itd -p ${hostPort}:3001 ${img_name}
echo "run container end"

#!/bin/bash
IMAGE_NAME='node-nset'
CONTAINER_NAME='node-nest'
HOST_PORT=3001
CONTAINER_PORT=3001
HOST_APP_PATH='/Users/huangyuan/work-space/restaurant-qiwei'
CONTAINER_APP_PATH='/app'
NODE_VERSION='16.18.0'

ENV=$1

echo "current enviornment ${ENV}"

if [ -z "${ENV}" ]; then
  echo "please input enviornment"
  exit 1
fi


#镜像不存在则需要构建
imgId=$(docker images -q --filter reference=${IMAGE_NAME})
if [ ! "${imgId}" ]; then
  echo "build node-nest start"
  docker build --build-arg NODE_VERSION=${NODE_VERSION} -t ${IMAGE_NAME} .
  echo "build node-nest end"
fi

# 后期考虑优化 停掉容器时 如果编译失败的问题
##删除重复的容器
nodeConId=$(docker ps -a --filter="name=${CONTAINER_NAME}" -q | xargs)
if [ -n "${nodeConId}" ]; then
  echo "stop rm container start"
  docker stop "${nodeConId}"
  docker rm -v "${nodeConId}"
  echo "stop rm container end"
fi

echo "node-nest run start"
docker run --restart=always --name ${CONTAINER_NAME} -v ${HOST_APP_PATH}:${CONTAINER_APP_PATH} -it -p ${HOST_PORT}:${CONTAINER_PORT} ${IMAGE_NAME} bash -c "yarn && yarn run build && yarn start:${ENV}"
echo "node-nest run end"
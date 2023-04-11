#!/bin/bash
IMAGE_NAME='node-nset'
CONTAINER_NAME='node-nest'
HOST_PORT=32212
CONTAINER_PORT=32212
HOST_APP_PATH='/data/htdoc/restaurant-qiwei'
CONTAINER_APP_PATH='/app'
NODE_VERSION='16.18.0'
ENV=$1
SLEEP_TIME=20

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
  echo "stop-remove container start"
  docker stop "${nodeConId}"
  docker rm -v "${nodeConId}"
  echo "stop-remove container end"
fi


echo "node-nest run start"
docker run --restart=always --name ${CONTAINER_NAME} -v ${HOST_APP_PATH}:${CONTAINER_APP_PATH} -itd -p ${HOST_PORT}:${CONTAINER_PORT} ${IMAGE_NAME} bash -c "yarn && yarn run build && yarn start:${ENV}"

# 暂时只能想到这种方案，等待固定时间,查询服务是否在监听，判断项目是否启动成功
echo "test service is running,current waiting time ${SLEEP_TIME}s"
echo "loading..."

sleep ${SLEEP_TIME}
docker logs ${CONTAINER_NAME}
command=$(netstat -an | grep LISTEN | grep :${HOST_PORT})
echo "service: ${command}"
if [ "$command" == "" ]
  then
  echo "node-nest is not sure running,please check docker container node-nest logs"
  exit 1
  else
  echo "node-nest run success"
  exit 0
fi

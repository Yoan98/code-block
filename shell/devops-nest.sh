#!/bin/bash
SERVICE_NAME='node-nest'
HOST_PORT=9221
SLEEP_TIME=20
DOCKER_PATH='./nest-docker/docker-compose.yml'

ENV=$1

# 注入动态环境变量
export NODE_ENV=${ENV}

echo "####################current enviornment ${ENV}"

if [ -z "${ENV}" ]; then
  echo "#####################please input enviornment"
  exit 1
fi



nodeConId=$(docker ps -a --filter="name=${SERVICE_NAME}" -q | xargs)
if [ -n "${nodeConId}" ]; then
  #容器存在，则重启当前的容器
  echo "####################container restart"
  docker-compose -f ${DOCKER_PATH} restart ${SERVICE_NAME}
  else
  # 不存在，则创建容器
  echo "######################node-nest run up"

  docker-compose -f ${DOCKER_PATH} up -d ${SERVICE_NAME}
fi



# 查询服务是否在监听，判断项目是否启动成功
echo "######################test service is running,current waiting time ${SLEEP_TIME}s"
echo "######################loading..."

sleep ${SLEEP_TIME}
docker logs ${SERVICE_NAME}
command=$(netstat -an | grep LISTEN | grep :${HOST_PORT})
echo "service: ${command}"
if [ "$command" == "" ]
  then
  echo "#############################node-nest is not sure running,please check docker container node-nest logs"
  exit 1
  else
  echo "###############################node-nest is listening"
  exit 0
fi

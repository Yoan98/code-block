# 适用于node后端的
ARG NODE_VERSION
FROM node:${NODE_VERSION}

RUN mkdir -p /app && \
  mkdir -p /opt/node/node_global && \
  mkdir -p /opt/node/node_cache && \
  yarn config set registry https://registry.npmmirror.com --global && \
  yarn config set disturl https://npmmirror.com/dist --global && \
  yarn config set phantomjs_cdnurl http://npmmirror.com/mirrors/phantomjs --global && \
  yarn config set prefix "/opt/node/yarn_global" --global && \
  yarn config set cache "/opt/node/yarn_cache" --global

#    yarn config list && \
RUN yarn config set prefix "/opt/node/yarn_global" && \
  yarn config set cache "/opt/node/yarn_cache"

VOLUME ["/opt", "/app" ]
WORKDIR /app

CMD ["node"]
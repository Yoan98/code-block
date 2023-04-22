ARG NODE_VERSION=${NODE_VERSION}
FROM node:${NODE_VERSION}

RUN mkdir -p /var/www/html && \
  mkdir -p /opt/node/node_global && \
  mkdir -p /opt/node/node_cache && \
  npm config set registry https://registry.npmmirror.com --global && \
  npm config set prefix "/opt/node/node_global" --global && \
  npm config set cache "/opt/node/node_cache" --global && \
  
  yarn config set registry https://registry.npmmirror.com && \
  yarn config set prefix "/opt/node/yarn_global" && \
  yarn config set cache-folder "/opt/node/yarn_cache"

USER node

VOLUME [ "/opt", "/var/www/html"]
WORKDIR /var/www/html

CMD ["node"]

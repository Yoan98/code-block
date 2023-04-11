ARG NODE_VERSION=${NODE_VERSION}
FROM node:${NODE_VERSION}

USER root
RUN mkdir -p /var/www/html && \
  mkdir -p /opt/node/node_global && \
  mkdir -p /opt/node/node_cache && \
  chown -R node.node /opt/node && \
  npm config set registry https://registry.npmmirror.com --global && \
  npm config set disturl https://npmmirror.com/dist --global && \
  npm config set sass_binary_site https://npmmirror.com/mirrors/node-sass/ --global && \
  npm config set phantomjs_cdnurl http://npmmirror.com/mirrors/phantomjs --global && \
  npm config set ELECTRON_MIRROR http://npmmirror.com/mirrors/electron/ --global && \
  npm config set prefix "/opt/node/node_global" --global && \
  npm config set cache "/opt/node/node_cache" --global && \
  #    npm install -g react-native-cli node-sass && \
  yarn config set registry https://registry.npmmirror.com --global && \
  yarn config set disturl https://npmmirror.com/dist --global && \
  yarn config set sass_binary_site https://npmmirror.com/mirrors/node-sass/ --global && \
  yarn config set phantomjs_cdnurl http://npmmirror.com/mirrors/phantomjs --global && \
  yarn config set ELECTRON_MIRROR http://npmmirror.com/mirrors/electron/ --global && \
  yarn config set prefix "/opt/node/yarn_global" --global && \
  yarn config set cache "/opt/node/yarn_cache" --global

#    npm config ls -l&& \
#    yarn config list && \
USER node
RUN yarn config set prefix "/opt/node/yarn_global" && \
  yarn config set cache "/opt/node/yarn_cache" && \
  npm install -g pnpm node-sass
USER root
RUN ln -s /opt/node/node_global/bin/pnpm /usr/local/bin/pnpm && \
  ln -s /opt/node/node_global/bin/pnpx /usr/local/bin/pnpx && \
  ln -s /opt/node/node_global/bin/node-sass /usr/local/bin/node-sass

USER node

VOLUME [ "/opt", "/var/www/html"]
WORKDIR /var/www/html

CMD ["node"]
# See here for image contents: https://github.com/microsoft/vscode-dev-containers/tree/v0.195.0/containers/javascript-node/.devcontainer/base.Dockerfile
FROM mcr.microsoft.com/vscode/devcontainers/javascript-node:16-bullseye

#TODO: add emscriptem
#TODO: add esphome python images?

ENV \
  DEBIAN_FRONTEND=noninteractive \
  DEVCONTAINER=true \
  PATH=$PATH:./webapp/node_modules/.bin

ARG USER_NAME=node
USER $USER_NAME

# Install emsdk: https://emscripten.org/docs/getting_started/downloads.html
ARG EMSDK=/home/$USER_NAME/emsdk
ARG EMSDK_VERSION=latest
RUN set -ux \
 && git clone --depth 1 https://github.com/emscripten-core/emsdk.git $EMSDK \
 && $EMSDK/emsdk install $EMSDK_VERSION \
 && $EMSDK/emsdk activate $EMSDK_VERSION \
 && echo "source $(realpath $EMSDK/emsdk_env.sh) > /dev/null 2>&1" | sudo tee -a /etc/bash.bashrc > /dev/null
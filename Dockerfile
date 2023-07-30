FROM node:14-buster-slim

WORKDIR /usr/src/app
COPY . .

RUN yarn install --frozen-lockfile --production --network-timeout 300000 && \
  yarn cache clean --all && \
  apt-get update && \
  apt-get -y install \
  curl \
  libgssapi-krb5-2 \
  libk5crypto3 \
  libkrb5-3 \
  python3-distutils \
  && \
  rm -rf /var/lib/apt/lists/*

RUN mkdir /tmp/pip && \
  curl --silent https://bootstrap.pypa.io/get-pip.py --output /tmp/pip/get-pip.py && \
  python3 /tmp/pip/get-pip.py && \
  rm -rf /tmp/pip

RUN pip3 install maigret -U

COPY start-orion-api.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/start-orion-api.sh

ENTRYPOINT ["/usr/local/bin/start-orion-api.sh"]

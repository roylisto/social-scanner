FROM node:14-buster-slim

ARG TARGETPLATFORM="${TARGETPLATFORM:-linux/amd64}"
ARG TARGETOS="${TARGETOS:-linux}"
ARG TARGETARCH="${TARGETARCH:-amd64}"
ARG SHELLCHECK_VERSION="v0.7.1"

RUN apt-get update -y && \
  apt-get install -y \
  git \
  # For shellcheck, yamllint, and the CI script.
  curl jq python3-distutils xz-utils \
  && \
  rm -rf /var/cache/apt/* /var/lib/apt/lists/* && \
  apt-get clean -y

RUN mkdir /tmp/shellcheck && \
  SHELLCHECK_ARCH=$([ "${TARGETARCH}" = "amd64" ] && echo x86_64 || echo ${TARGETARCH}) && \
  curl --silent --location --output /tmp/shellcheck/shellcheck.tar.xz "https://github.com/koalaman/shellcheck/releases/download/${SHELLCHECK_VERSION}/shellcheck-${SHELLCHECK_VERSION}.${TARGETOS}.${SHELLCHECK_ARCH}.tar.xz" && \
  tar -xJvf /tmp/shellcheck/shellcheck.tar.xz -C /tmp/shellcheck && \
  cp "/tmp/shellcheck/shellcheck-${SHELLCHECK_VERSION}/shellcheck" /usr/bin/ && \
  rm -rf /tmp/shellcheck

RUN mkdir /tmp/pip && \
  curl --silent https://bootstrap.pypa.io/get-pip.py --output /tmp/pip/get-pip.py && \
  python3 /tmp/pip/get-pip.py && \
  rm -rf /tmp/pip

RUN pip3 install maigret -U

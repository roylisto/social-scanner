#!/usr/bin/env bash

yarn install || sleep 600
exec yarn dev:run

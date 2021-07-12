#!/bin/bash

docker build -t codilitydeploy/shopapp2:latest .

docker login

docker push codilitydeploy/shopapp2:latest

docker image prune -f

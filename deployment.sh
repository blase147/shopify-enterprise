#!/bin/bash

docker build -t codilitydeploy/shopapp:latest .

docker login

docker push codilitydeploy/shopapp:latest

docker image prune -f

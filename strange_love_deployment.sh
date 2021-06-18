#!/bin/bash

docker build -t codilitydeploy/strange_love:latest .

docker login

docker push codilitydeploy/strange_love:latest

docker image prune -f

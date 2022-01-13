#!/bin/bash

docker build -t codilitydeploy/worldfare:latest .

docker login

docker push codilitydeploy/worldfare:latest

docker image prune -f

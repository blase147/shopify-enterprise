#!/bin/bash

docker build -t codilitydeploy/bagamour:latest .

docker login

docker push codilitydeploy/bagamour:latest

docker image prune -f


  
#!/bin/bash

docker build -t codilitydeploy/ethey:latest .

docker login

docker push codilitydeploy/ethey:latest

docker image prune -f
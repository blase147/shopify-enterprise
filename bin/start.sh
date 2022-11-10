#!/bin/bash

# exit if ret status not 0
set -o errexit

readonly RAILS_CMD="$(pwd)/bin/rails"
readonly BASHRC="$HOME"/.bashrc

source_rc() {
  . "$BASHRC"
}

configure_db() {
  echo "configuring DB for $RAILS_ENV runtime"
  if [ "$RAILS_ENV" = "development" ]; then
    "$RAILS_CMD" db:create
    "$RAILS_CMD" db:migrate
    # "$RAILS_CMD" db:seed
  else
    echo "running migration for $RAILS_ENV"
    "$RAILS_CMD" db:migrate:ignore_concurrent
    "$RAILS_CMD" assets:precompile
  fi
}

install_nodejs() {
  # source bashrc
  echo "installing nodejs"
  source_rc
  nvm install 12.22.8
}

install_node_modules() {
  # install yarn
  echo "installing yarn and node modules"
  curl -o- -L https://yarnpkg.com/install.sh | bash
  source_rc
  yarn
}

install_bundle() {
  # bundle install
  echo "doing bundle install"
  bundle install
  gem install scss_lint
}

boot_api() {
  "$RAILS_CMD" s --binding 0.0.0.0 -p 3000
}

main() {
  echo "bootstrapping dependencies"
  install_nodejs
  install_node_modules
  install_bundle
  configure_db

  # run the rails server
  echo "starting api"
  boot_api
}
main

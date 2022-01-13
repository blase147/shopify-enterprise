#!/bin/bash

RAILS_ENV=production rails db:migrate
bundle exec whenever -c && bundle exec whenever --update-crontab -i "chargezen_production" --set environment=production && touch ./log/cron_log.log
crond
bundle exec rails s -e production -b 0.0.0.0 -d
RAILS_ENV=production bundle exec sidekiq -c 5

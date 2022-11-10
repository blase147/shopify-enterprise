#!/bin/bash

rails db:migrate
bundle exec whenever -c && bundle exec whenever --update-crontab -i "chargezen_production" --set environment=production && touch ./log/cron_log.log
crond
bundle exec rails s -b 0.0.0.0 -d
bundle exec sidekiq -c 10 -e production

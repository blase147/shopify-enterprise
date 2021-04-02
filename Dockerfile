#FROM ruby:2.7.0-buster AS base
FROM ruby:2.7.0-alpine AS base

#RUN apt-get update && \
#    apt-get install -y software-properties-common curl build-essential pkg-config \
#    libpq-dev nodejs npm

RUN apk add --update build-base postgresql-dev nodejs npm tzdata && rm -rf /var/cache/apk/*
RUN npm install --global yarn


WORKDIR /app


COPY Gemfile Gemfile.lock ./

RUN bundle config set deployment 'true' && bundle config set without 'development test'
RUN apk add shared-mime-info
RUN gem install mimemagic -v '0.3.10' --source 'https://rubygems.org/'
RUN bundle install --jobs=4
COPY package.json yarn.lock /app/
RUN yarn install  --check-files
COPY . /app
RUN bundle exec rake assets:precompile RAILS_ENV=production
#RUN rm -rf /app/node_modules
#RUN rm -rf /app/tmp/*

FROM ruby:2.7.0-alpine
WORKDIR /app
RUN apk add --update build-base postgresql-dev nodejs tzdata && rm -rf /var/cache/apk/*
RUN apk add shared-mime-info

COPY --from=base /app /app

# copy gems that already build
COPY --from=base /usr/local/bundle/ /usr/local/bundle/
CMD ["bundle", "exec", "rails", "db:migrate", "-e", "production"]
CMD ["bundle", "exec", "rails", "s", "-e", "production", "-b", "0.0.0.0"]

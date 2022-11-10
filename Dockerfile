FROM ruby:2.7.6-alpine3.15 as development

COPY --from=node:12.22.12-alpine3.15 /usr/local/bin/node /usr/local/bin
COPY --from=node:12.22.12-alpine3.15 /opt/yarn-v1.22.18 /opt/yarn-v1.22.18

RUN ln -s /usr/local/bin/node /usr/local/bin/nodejs
RUN ln -s /opt/yarn-v1.22.18/bin/yarn /usr/local/bin/yarn
RUN ln -s /opt/yarn-v1.22.18/bin/yarnpkg /usr/local/bin/yarnpkg

RUN apk add --update --upgrade --no-cache  \
      build-base \
      gcc \
      postgresql-dev \
      nodejs \
      tzdata \
      libffi-dev \
      gcompat \
      bash \
      shared-mime-info \
      python2 \
      busybox-initscripts

# RUN bundle config force_ruby_platform true

WORKDIR /app

COPY Gemfile Gemfile.lock package.json yarn.lock ./

FROM development as production

COPY . .

ENV RAILS_ENV=production
ENV RACK_ENV=production

RUN bundle config set deployment 'true' && bundle config set without 'development test'
RUN bundle install --jobs=6 --retry=3
RUN yarn install
RUN RAILS_ENV=production bundle exec rake assets:precompile 

RUN rm -rf /app/node_modules
RUN rm -rf /var/cache/apk/*

ENTRYPOINT ["/bin/bash","/app/bin/docker-entrypoint.sh"]

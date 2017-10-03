FROM google/cloud-sdk:170.0.1-alpine

RUN apk --update add openjdk7-jre
RUN gcloud components install --quiet beta pubsub-emulator
RUN mkdir -p /var/pubsubdata

VOLUME /var/pubsubdata

EXPOSE 8085

CMD [ "gcloud", "beta", "emulators", "pubsub", "start", "--data-dir=/var/pubsubdata", "--host-port=0.0.0.0:8085", "--log-http", "--verbosity=debug", "--user-output-enabled" ]

#!/bin/bash

set -e

NAME="sid"

GC_PROJECT="poplar-178404"

D="docker"
DC="docker-compose"
GC="gcloud"

function helptext {
    echo "Usage: ./go <command>"
    echo ""
    echo "Available commands are:"
    echo "    bootstrap         Set up working environment"
    echo "    build [app]       Build and publish a docker image to the registry"
    echo "    exec [app] [cmd]  Run command in container"
    echo "    start [app]       Run app in dev mode"
}

function bootstrap {
  ${DC} build app_api
  ${DC} build web
  ${DC} build app
  ${DC} build emailer
  ${DC} build knowledge_base
  ${DC} build r_studio

  ${DC} run app_api npm run migrate
  ${DC} run knowledge_base npm run migrate
  ${DC} run -e DATABASE_HOST=testpg -e DATABASE_DATABASE=sid_test app_api npm run migrate
  ${DC} run -e DATABASE_HOST=knowledge_base_testpg -e DATABASE_DATABASE=knowledge_base_test knowledge_base npm run migrate
}

function start {
  shift
  ${DC} up $@
}

function exec {
  shift
  ${DC} run $@
}

function build {
  shift

  case "$@" in
    app) BUILD_PATH="app"                       ;;
    app_api) BUILD_PATH="app-api"               ;;
    emailer) BUILD_PATH="emailer"               ;;
    knowledge_base) BUILD_PATH="knowledge-base" ;;
    web) BUILD_PATH="web"                       ;;
  esac

  BUILD_TAG=$(date +'%Y%m%d%H%M%S')_$@
  ${D} build ${BUILD_PATH} -t $@:${BUILD_TAG}
  ${D} tag $@:${BUILD_TAG} us.gcr.io/${GC_PROJECT}/$@:${BUILD_TAG}
  ${GC} ${D} -- push us.gcr.io/${GC_PROJECT}/$@:${BUILD_TAG}
}

case "$1" in
  bootstrap)  bootstrap ;;
  build)      build $@  ;;
  exec)       exec $@   ;;
  start)      start $@  ;;
  *)          helptext  ;;
esac

#!/bin/bash

set -e

NAME="sid"

DC="docker-compose"

function helptext {
    echo "Usage: ./go <command>"
    echo ""
    echo "Available commands are:"
    echo "    bootstrap         Set up working environment"
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

case "$1" in
  bootstrap)  bootstrap ;;
  exec)       exec $@   ;;
  start)      start $@  ;;
  *)          helptext  ;;
esac

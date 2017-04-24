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
  ${DC} build web_api
  ${DC} build web
  ${DC} build app
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

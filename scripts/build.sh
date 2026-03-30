#!/bin/bash
cd `dirname $0`/..
set -e

install_lib() {
  mkdir -p node_modules/@termx-health
  rm -rf "node_modules/@termx-health/$1"
  cp -r "dist/$1" "node_modules/@termx-health/$1"
}

rm -rf dist

echo "Building core-util"
ng build core-util
install_lib core-util

echo "Building util"
ng build util
install_lib util

echo "Building ui"
ng build ui
install_lib ui

echo "Building markdown-parser"
ng build markdown-parser
install_lib markdown-parser

echo "Building markdown"
ng build markdown

echo "Building quill"
ng build quill

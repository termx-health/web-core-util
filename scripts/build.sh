#!/bin/bash
cd `dirname $0`/..

rm -rf dist

for d in core-translate core-misc core-util; do
  echo "Building $d"
  ng build $d || exit 1
  rm -rf node_modules/@kodality-web/$p && cp -r dist/$p node_modules/@kodality-web/$p
done

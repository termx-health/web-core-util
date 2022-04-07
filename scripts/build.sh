#!/bin/bash
cd `dirname $0`/..

rm -rf dist

for d in core-util core-misc; do
  echo "Building $d"
  ng build $d || exit 1
done

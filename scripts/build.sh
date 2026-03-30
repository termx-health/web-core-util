#!/bin/bash
cd `dirname $0`/..
set -e

rm -rf dist

echo "Building core-util"
ng build core-util

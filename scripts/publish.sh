#!/bin/bash
cd `dirname $0`/..
VERSION=$1

declare -A package_versions

for p in core-util; do
  cd $p

  if [ -z $VERSION ]; then
    v=$(cat package.json | sed -n 's/^ *"version": "\(.*\)",/\1/p')
    ts=$(date +%s)
    version=$(echo "$v" | sed "s/.0.0$/.0.0-SNAPSHOT.$ts/g")
    package_versions[$p]=$version
  else
    package_versions[$p]=$VERSION
  fi

  [[ -z "${package_versions[$p]}" ]] && echo "give me a version" && exit 1
  cd -
done


for key in ${!package_versions[@]}; do
  cd dist/$key

  VERS_JSON="\"version\": \"${package_versions[$key]}\","
  sed -i -e "s/\"version\": \"\(.*\)\",/$VERS_JSON/" package.json

  echo "package(${key}): publish ${package_versions[$key]}";

  npm publish
  cd -
done


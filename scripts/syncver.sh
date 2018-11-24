#!/bin/bash

set -e

if [ ${#@} -ne 0 ] && [ "${@#"--help"}" = "" ]; then
  printf -- 'You should not be calling this directly, it should be called as part of the release process.\n';
  exit 0;
fi;


empirica_version=$(node -e "process.stdout.write(JSON.parse(require('fs').readFileSync('package.json', 'utf8')).version)")
sed -i "" -E "s/version: \"[0-9]*.[0-9]*.[0-9]*\",/version: \"$empirica_version\",/" package.js
git add package.js

printf -- 'Bumped package.js version to %s' $empirica_version
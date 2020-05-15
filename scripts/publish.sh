#!/bin/bash

# NOTE: This is used for internal Okta testing.  Meaningless outside of Okta.

source ${OKTA_HOME}/${REPO}/scripts/setup.sh

export TEST_SUITE_TYPE="build"
export PATH="${PATH}:$(yarn global bin)"

yarn global add @okta/ci-update-package
yarn global add @okta/ci-pkginfo

if [ -n "${action_branch}" ]; then
  echo "Publishing from bacon task using branch ${action_branch}"
  TARGET_BRANCH=${action_branch}
else
  echo "Publishing from bacon testSuite using branch ${BRANCH}"
  TARGET_BRANCH=${BRANCH}
fi

if ! ci-update-package --branch ${TARGET_BRANCH}; then
  echo "ci-update-package failed! Exiting..."
  exit $FAILED_SETUP
fi

if ! npm publish --unsafe-perm; then
  echo "npm publish failed! Exiting..."
  exit ${PUBLISH_ARTIFACTORY_FAILURE}
fi

DATALOAD=$(ci-pkginfo -t dataload)
if ! artifactory_curl -X PUT -u ${ARTIFACTORY_CREDS} ${DATALOAD} -v -f; then
  echo "artifactory_curl failed! Exiting..."
  exit ${PUBLISH_ARTIFACTORY_FAILURE}
fi

exit ${SUCCESS}

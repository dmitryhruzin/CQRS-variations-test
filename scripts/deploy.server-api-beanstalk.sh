echo "Install all dependencies in root"
yarn --immutable

echo "Build app"
target=$APP yarn build

echo "Cleanup root node_modules"
rm -rf node_modules

echo "Set yarn nohoist mode"
yarn config set nmHoistingLimits workspaces

echo "Install app only dependencies"
yarn workspaces focus @dbbs/$APP

cd apps/$APP

echo "Extract app version"
MAJOR_MINOR_VERSION=$(jq -r '.version' package.json | cut -d. -f1-2)
NEW_DEPLOY_VERSION=$(jq -r '.version' package.json | cut -d. -f3 | awk '{print $1 + 1}')
NEW_FULL_VERSION="$MAJOR_MINOR_VERSION.$NEW_DEPLOY_VERSION"

echo "Set variable depending in existing CI workflow id"
BUILD_ID=$([[ -n "$RUN_ID" ]] && echo "$RUN_ID" || echo "$NEW_DEPLOY_VERSION")

echo "Beanstalk bundle configuration"
cp Procfile dist/Procfile && cp -r .platform dist && cp package.json dist/package.json

echo "Copy prod modules to bundle"
rsync -avhL --quiet node_modules/ dist/node_modules/

echo "Zip eventual bundle"
cd dist && zip $BUILD_ID.zip * -rq .[^.]*

echo "Upload to Elastic Beanstalk"
aws s3 cp $BUILD_ID.zip s3://$BUCKET/$BEANSTALK_APP/$BUILD_ID-$STAGE.zip
aws elasticbeanstalk create-application-version --application-name $BEANSTALK_APP --version-label $BUILD_ID-$STAGE --source-bundle S3Bucket="$BUCKET",S3Key="$BEANSTALK_APP/$BUILD_ID-$STAGE.zip"
aws elasticbeanstalk update-environment --environment-name $BEANSTALK_ENVIRONMENT-$STAGE --version-label $BUILD_ID-$STAGE

if [ -z "$RUN_ID" ]; then
  echo "Update package.json version"
  jq --arg v "$NEW_FULL_VERSION" '.vjersion = $v' package.json > temp.json && mv temp.json package.json

  echo "Commit changes"
  git add package.json
  git add package.json
  git commit -m "[skip ci] Bump $APP version with run id $BUILD_ID"

  echo "Tag release version"
  git tag $APP-$STAGE-$BUILD_ID

  echo 'Need to git push after update package.json version and create tag '
fi

echo "Unset yarn nohoist mode"
cd ../../..
yarn config unset nmHoistingLimits

echo "App $APP successfully deployed on $STAGE stage with id $RUN_ID"

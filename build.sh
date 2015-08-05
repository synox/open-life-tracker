#!/bin/bash

bower install

# concat dependencies
FILES_JS="bower_components/jquery/dist/jquery.min.js  
bower_components/bootstrap/dist/js/bootstrap.min.js 
bower_components/angular/angular.min.js 
bower_components/angular-flash-alert/dist/angular-flash.min.js 
bower_components/angular-i18n/angular-locale_de-ch.js 
bower_components/lodash/lodash.min.js  
bower_components/d3/d3.min.js 
bower_components/n3-line-chart/build/line-chart.min.js 
bower_components/angular-utf8-base64/angular-utf8-base64.min.js"

export FILES_CSS="bower_components/bootstrap/dist/css/bootstrap.min.css  
bower_components/angular-flash-alert/dist/angular-flash.min.css"


TARGET=app/assets/dependencies

echo > $TARGET.js
for f in $FILES_JS; do 
echo -e "\n;//$f: \n" >> $TARGET.js
cat $f >> $TARGET.js
done

echo > $TARGET.css
for f in $FILES_CSS; do 
echo -e "\n/*$f*/\n" >> $TARGET.css
cat $f >> $TARGET.css
done

echo "wrote libraries:"
ls -hl $TARGET.js
ls -hl $TARGET.css

# make offline.appcache
(
cd app
export FILES="$(find * -type f -not -name offline.appcache -and -not -name .DS_Store -and -not -name ".*")"
  (
  echo -e "CACHE MANIFEST\n"
  echo "CACHE:"
  for f in $FILES; do
      echo $f
  done
  echo -e "\n\nNETWORK:"
  echo "*"
  HASH="$(md5 $FILES | md5)"
  echo "# $HASH"
  ) > offline.appcache
)
echo "wrote app/offline.appcache"

@echo off
call npm run docs:build

cd docs\.vuepress\dist

git init
git add -A
git commit -m "deploy"

git push -f git@github.com:Blade-H1kar1/vue-super-crud.git master:gh-pages

cd ..\..

rmdir /s /q docs\.vuepress\dist
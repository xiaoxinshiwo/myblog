#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 生成静态文件
yarn docs:build

# 进入生成的文件夹
cd docs/.vuepress/dist

# 如果是发布到自定义域名
# echo 'www.example.com' > CNAME

 git init
 git add -A
 git commit -m 'deploy'


# 发布到 https://xiaoxinshiwo.github.io/zhangyongxin
 git push -f git@github.com:xiaoxinshiwo/zhangyongxin.git master:gh-pages

cd -

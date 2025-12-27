# 确保脚本抛出遇到的错误
set -e

# 1. 删除 dist 文件夹
rm -rf dist

# 2. 打包生成静态文件
npm run build

# 3. 切换到 dist 目录
cd dist/

# 4. 初始化 git 仓库分支并本地提交
git init -b pages
git add -A
git commit -m '静态托管'

# 5. 推送 pages 分支到远程仓库
# git push -f https://atomgit.com:<USERNAME>/<REPO>.git pages
git push -f https://github.com/chenxiaozao/interview.git pages

cd -
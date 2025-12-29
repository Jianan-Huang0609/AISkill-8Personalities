#!/bin/bash
# 修复 package-lock.json 脚本
# 在 Git Bash 或 Linux/Mac 终端中运行: bash fix-lockfile.sh

echo "正在修复 package-lock.json..."

# 删除旧的 lock 文件
if [ -f "package-lock.json" ]; then
    rm package-lock.json
    echo "已删除旧的 package-lock.json"
fi

# 重新安装依赖
echo "正在重新安装依赖..."
npm install

# 验证
echo ""
echo "验证安装..."
npm list html2canvas jspdf

echo ""
echo "完成！现在可以提交 package-lock.json 到 Git 了。"
echo "运行以下命令提交:"
echo "  git add package-lock.json"
echo "  git commit -m 'fix: 更新 package-lock.json，添加缺失的依赖'"
echo "  git push"


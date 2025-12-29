# 修复 package-lock.json 脚本
# 在 PowerShell 中运行: .\fix-lockfile.ps1

Write-Host "正在修复 package-lock.json..." -ForegroundColor Yellow

# 删除旧的 lock 文件
if (Test-Path "package-lock.json") {
    Remove-Item "package-lock.json" -Force
    Write-Host "已删除旧的 package-lock.json" -ForegroundColor Green
}

# 重新安装依赖
Write-Host "正在重新安装依赖..." -ForegroundColor Yellow
npm install

# 验证
Write-Host "`n验证安装..." -ForegroundColor Yellow
npm list html2canvas jspdf

Write-Host "`n完成！现在可以提交 package-lock.json 到 Git 了。" -ForegroundColor Green
Write-Host "运行以下命令提交:" -ForegroundColor Cyan
Write-Host "  git add package-lock.json" -ForegroundColor White
Write-Host "  git commit -m 'fix: 更新 package-lock.json，添加缺失的依赖'" -ForegroundColor White
Write-Host "  git push" -ForegroundColor White


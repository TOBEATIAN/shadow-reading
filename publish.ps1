$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $root
$python = "E:\WorkSpace\Project_04_专门学习\Project_02_六级\模拟卷\scripts\.venv\Scripts\python.exe"

Write-Host "第一步：构建网站数据与音频..."
& $python (Join-Path $root "scripts\build_site.py")
if ($LASTEXITCODE -ne 0) {
    Write-Host "构建失败，未发布。"
    exit 1
}

Write-Host "第二步：提交并推送..."
git add -A
$staged = git diff --cached --name-only
if (-not $staged) {
    Write-Host "没有变更，无需发布。"
    exit 0
}
git commit -m "更新影子跟读网站"
git push origin main
if ($LASTEXITCODE -ne 0) {
    Write-Host "推送失败，请检查网络后重试。"
    exit 1
}
Write-Host "已发布：https://tobeatian.github.io/shadow-reading/"

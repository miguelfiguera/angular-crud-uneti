# Pobla la base de datos MongoDB con las 5 colecciones del proyecto.
$ErrorActionPreference = "Stop"

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$RootDir = Split-Path -Parent $ScriptDir

Write-Host "========================================"
Write-Host "  Seed MongoDB - Cine UNETI (Windows)"
Write-Host "========================================"

Set-Location $RootDir
node backend/src/seed/seed.js

Write-Host "Seed completado."

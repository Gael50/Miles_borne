#Requires -Version 5.1
<#
.SYNOPSIS
    Build automatique Mille Bornes — bump version patch (+0.0.1) + .exe portable.
.PARAMETER DryRun
    Bumpe la version uniquement, sans lancer le build electron.
.EXAMPLE
    .\release.ps1
    .\release.ps1 -DryRun
#>
param(
    [switch]$DryRun
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$Root = $PSScriptRoot

function Write-Step([string]$msg) {
    Write-Host "`n== $msg ==" -ForegroundColor Cyan
}

function Assert-Command([string]$cmd) {
    if (-not (Get-Command $cmd -ErrorAction SilentlyContinue)) {
        Write-Host "ERREUR : '$cmd' introuvable. Assure-toi que Node.js est dans ton PATH." -ForegroundColor Red
        exit 1
    }
}

Assert-Command 'node'
Assert-Command 'npm'

# ── 1. Version avant bump ───────────────────────────────────────────────────
$pkgBefore = Get-Content "$Root\package.json" -Raw | ConvertFrom-Json
$versionBefore = $pkgBefore.version

# ── 2. Bump version ─────────────────────────────────────────────────────────
Write-Step "Bump version ($versionBefore → patch+1)"
node "$Root\scripts\bump-version.js"

$pkgAfter = Get-Content "$Root\package.json" -Raw | ConvertFrom-Json
$versionAfter = $pkgAfter.version
Write-Host "Version : $versionBefore → $versionAfter" -ForegroundColor Green

if ($DryRun) {
    Write-Host "`n[DryRun] Version mise a jour. Build ignore." -ForegroundColor Yellow
    exit 0
}

# ── 3. Build renderer (minifie) ─────────────────────────────────────────────
Write-Step "Build renderer (esbuild --minify)"
npx esbuild "$Root\src\renderer.jsx" --minify "--outfile=$Root\assets\renderer.js"
if ($LASTEXITCODE -ne 0) { Write-Host "ERREUR esbuild" -ForegroundColor Red; exit 1 }

# ── 4. Electron-builder ──────────────────────────────────────────────────────
Write-Step "Electron-builder --win (portable .exe)"
# On appelle electron-builder directement pour eviter que 'prebuild' re-bumpe la version
npx electron-builder --win
if ($LASTEXITCODE -ne 0) { Write-Host "ERREUR electron-builder" -ForegroundColor Red; exit 1 }

# ── 5. Confirmation ──────────────────────────────────────────────────────────
$distDir = "$Root\dist"
if (Test-Path $distDir) {
    $exes = Get-ChildItem $distDir -Filter '*.exe' -ErrorAction SilentlyContinue
    if ($exes) {
        Write-Host "`nBuild termine - v$versionAfter" -ForegroundColor Green
        $exes | ForEach-Object { Write-Host "  dist\$($_.Name)  ($([math]::Round($_.Length/1MB, 1)) MB)" }
    } else {
        Write-Host "`nBuild termine mais aucun .exe trouve dans dist\" -ForegroundColor Yellow
    }
} else {
    Write-Host "`nDossier dist\ introuvable apres le build." -ForegroundColor Yellow
}

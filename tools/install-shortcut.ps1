<#
.SYNOPSIS
    Ставит иконку и ярлык «Калькулятор самогонщика».

.DESCRIPTION
    Почему иконка копируется в %LOCALAPPDATA%, а не берётся из папки проекта:
    проект лежит внутри рабочей папки DeepSeek Harness, а на неё навешаны
    защитные ACL. Проводник не может прочитать .ico оттуда и молча рисует
    стандартный значок «файл». В профиле пользователя такой проблемы нет.

.PARAMETER Desktop
    Дополнительно положить ярлык на рабочий стол.

.EXAMPLE
    powershell -ExecutionPolicy Bypass -File tools\install-shortcut.ps1 -Desktop
#>
param(
    [switch]$Desktop
)

$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
$iconSrc = Join-Path $root 'assets\icon.ico'
$target = Join-Path $root 'index.html'

if (-not (Test-Path $iconSrc)) { throw "Не найден $iconSrc — сначала запустите python tools/make_icon.py" }
if (-not (Test-Path $target)) { throw "Не найден $target" }

$iconDir = Join-Path $env:LOCALAPPDATA 'SamogonCalculator'
New-Item -ItemType Directory -Force -Path $iconDir | Out-Null
$icon = Join-Path $iconDir 'icon.ico'
Copy-Item $iconSrc $icon -Force
Write-Host "иконка:  $icon"

$ws = New-Object -ComObject WScript.Shell

$dirs = @($root)
if ($Desktop) { $dirs += [Environment]::GetFolderPath('Desktop') }

foreach ($dir in $dirs) {
    $lnk = Join-Path $dir 'Калькулятор самогонщика.lnk'
    if (Test-Path $lnk) { Remove-Item $lnk -Force }
    $s = $ws.CreateShortcut($lnk)
    $s.TargetPath = $target
    $s.WorkingDirectory = $root
    $s.IconLocation = "$icon,0"
    $s.Description = 'Калькулятор самогонщика: разбавление, брага, Brix, фракции'
    $s.Save()
    Write-Host "ярлык:   $lnk"
}

# сообщаем оболочке, что иконки могли измениться
Add-Type -TypeDefinition @"
using System;
using System.Runtime.InteropServices;
public class DshShellNotify {
    [DllImport("shell32.dll")] public static extern void SHChangeNotify(int eventId, uint flags, IntPtr item1, IntPtr item2);
}
"@ -ErrorAction SilentlyContinue
[DshShellNotify]::SHChangeNotify(0x08000000, 0x0000, [IntPtr]::Zero, [IntPtr]::Zero)

Write-Host 'Готово. Если ярлык всё ещё со старой картинкой — нажмите F5 на рабочем столе.'

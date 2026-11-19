# Jack World — recolle les morceaux d'une appli en une seule page.
#
# Chaque appli découpée a son dossier dans sources\ :
#   page.html        la page, avec des repères {{JW-MORCEAU:chemin}} à la place du code
#   styles\*.css     les feuilles de style, une par rôle
#   scripts\*.js     les programmes, un par rôle
#   donnees\*.txt    les grosses images intégrées (texte base64)
#   cible.txt        le fichier à produire (chemin relatif au dossier « Jack World en ligne »)
#
# Utilisation (depuis le dossier « Jack World en ligne ») :
#   powershell -ExecutionPolicy Bypass -File sources\assembler.ps1            (toutes les applis)
#   powershell -ExecutionPolicy Bypass -File sources\assembler.ps1 studio     (une seule)
#
# On modifie les morceaux, jamais la page produite : elle est réécrite à chaque assemblage.
param([string]$Appli = '')
$ErrorActionPreference = 'Stop'
$racine = Split-Path -Parent $PSScriptRoot
$utf8 = New-Object Text.UTF8Encoding $false
$dossiers = Get-ChildItem $PSScriptRoot -Directory | Where-Object { -not $Appli -or $_.Name -eq $Appli }
if (-not $dossiers) { throw "Aucune appli « $Appli » dans sources\." }
foreach ($d in $dossiers) {
  $page = [IO.File]::ReadAllText((Join-Path $d.FullName 'page.html'), [Text.Encoding]::UTF8)
  $cible = ([IO.File]::ReadAllText((Join-Path $d.FullName 'cible.txt'), [Text.Encoding]::UTF8)).Trim()
  $manquants = @()
  $resultat = $page
  # Un morceau peut lui-même contenir des repères (ex. une image de donnees\ dans un script) : on recolle jusqu'à 3 niveaux.
  for ($niveau = 0; $niveau -lt 3 -and $resultat.Contains('{{JW-MORCEAU:'); $niveau++) {
    $resultat = [regex]::Replace($resultat, '\{\{JW-MORCEAU:([^}]+)\}\}', {
      param($m)
      $f = Join-Path $d.FullName $m.Groups[1].Value
      if (-not (Test-Path $f)) { $script:manquants += $m.Groups[1].Value; return '' }
      [IO.File]::ReadAllText($f, [Text.Encoding]::UTF8)
    })
  }
  if ($manquants.Count) { throw "Morceaux introuvables pour $($d.Name) : $($manquants -join ', ')" }
  $sortie = Join-Path $racine $cible
  [IO.File]::WriteAllText($sortie, $resultat, $utf8)
  "{0} : {1} assemblé ({2:N0} Ko)" -f $d.Name, $cible, ((Get-Item $sortie).Length / 1KB)
}

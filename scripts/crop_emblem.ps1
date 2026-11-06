Add-Type -AssemblyName System.Drawing

$filePath = (Resolve-Path "img/logo-quimica.png").Path
$bmp = New-Object System.Drawing.Bitmap($filePath)

# Scan vertically from center X (503) downwards to find where text begins
$centerX = [int]($bmp.Width / 2)
Write-Host "Center X: $centerX, Height: $($bmp.Height)"

# Find top of emblem (non-background pixel)
$bg = $bmp.GetPixel(5, 5)
Write-Host "BG: $($bg.R), $($bg.G), $($bg.B)"

$topY = 0
for ($y = 0; $y -lt $bmp.Height; $y++) {
    $p = $bmp.GetPixel($centerX, $y)
    $diff = [Math]::Abs($p.R - $bg.R) + [Math]::Abs($p.G - $bg.G) + [Math]::Abs($p.B - $bg.B)
    if ($diff -gt 30) {
        $topY = $y
        break
    }
}

Write-Host "Emblem Top Y: $topY"

# Find bottom of the emblem gear (around 700-800)
# We can find the bounding box of the circular gear:
$minX = $bmp.Width
$maxX = 0
$minY = $bmp.Height
$maxY = 0

for ($y = 0; $y -lt 780; $y += 2) {
    for ($x = 0; $x -lt $bmp.Width; $x += 2) {
        $p = $bmp.GetPixel($x, $y)
        $diff = [Math]::Abs($p.R - $bg.R) + [Math]::Abs($p.G - $bg.G) + [Math]::Abs($p.B - $bg.B)
        if ($diff -gt 35) {
            if ($x -lt $minX) { $minX = $x }
            if ($x -gt $maxX) { $maxX = $x }
            if ($y -lt $minY) { $minY = $y }
            if ($y -gt $maxY) { $maxY = $y }
        }
    }
}

Write-Host "Emblem bounding box: X=[$minX, $maxX], Y=[$minY, $maxY]"
$bmp.Dispose()

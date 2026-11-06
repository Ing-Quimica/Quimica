Add-Type -AssemblyName System.Drawing

$srcPath = (Resolve-Path "img/logo-quimica.png").Path
$srcBmp = New-Object System.Drawing.Bitmap($srcPath)

# Bounding box for emblem centered at (503, 395)
# Crop size 750x750: X from (503 - 375 = 128), Y from (395 - 375 = 20)
$cropX = [Math]::Max(0, 503 - 375)
$cropY = [Math]::Max(0, 395 - 375)
$cropW = 750
$cropH = 750

$rect = New-Object System.Drawing.Rectangle($cropX, $cropY, $cropW, $cropH)
$cropped = New-Object System.Drawing.Bitmap($cropW, $cropH)
$g = [System.Drawing.Graphics]::FromImage($cropped)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$g.DrawImage($srcBmp, (New-Object System.Drawing.Rectangle(0, 0, $cropW, $cropH)), $rect, [System.Drawing.GraphicsUnit]::Pixel)
$g.Dispose()

$cropped.Save((Join-Path (Get-Location) "img/logo-quimica-emblema.png"), [System.Drawing.Imaging.ImageFormat]::Png)
$cropped.Save((Join-Path (Get-Location) "img/favicon.png"), [System.Drawing.Imaging.ImageFormat]::Png)

$cropped.Dispose()
$srcBmp.Dispose()

Write-Host "logo-quimica-emblema.png generated successfully!"

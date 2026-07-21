# Files that had ONLY !data?.personalInfo?.name (no fullName check)
$pattern1Files = @(
    'ClassicTemplate.jsx',
    'ModernTemplate.jsx',
    'ExecutiveTemplate.jsx',
    'AIGeneratedTemplate.jsx'
)

# Files that had !data?.personalInfo?.name && !data?.personalInfo?.fullName
$pattern2Files = @(
    'ProfessionalPremium.jsx',
    'ProfessionalGlobal.jsx',
    'ProfessionalFinance.jsx',
    'ProfessionalDirector.jsx',
    'ProfessionalCorporate.jsx',
    'ProfessionalConsultant.jsx',
    'ModernTimeline.jsx',
    'ModernTech.jsx',
    'ModernSplit.jsx',
    'ModernGrid.jsx',
    'ModernMinimalist.jsx',
    'ModernCards.jsx',
    'CreativeMinimalBold.jsx',
    'CreativeMagazine.jsx',
    'CreativeDesigner.jsx',
    'CreativeColorBlock.jsx',
    'CreativeArtist.jsx',
    'ClassicScholarly.jsx',
    'ClassicNew.jsx',
    'ClassicMinimal.jsx',
    'ClassicHeritage.jsx',
    'ClassicFormal.jsx',
    'ClassicElegant.jsx',
    'ATSTechnical.jsx',
    'ATSStandardClean.jsx',
    'ATSMinimalPro.jsx',
    'ATSExecutive.jsx',
    'ATSCompact.jsx'
)

# Files that had !data?.personalInfo?.fullName && !data?.personalInfo?.name (order reversed)
$pattern3Files = @(
    'ATSResumeTemplete.jsx',
    'CreativeTemplete.jsx'
)

$dir = $PSScriptRoot

foreach ($f in $pattern1Files) {
    $path = Join-Path $dir $f
    if (Test-Path $path) {
        $content = Get-Content $path -Raw
        $newContent = $content -replace [regex]::Escape('!data?.personalInfo;'), '!data?.personalInfo?.name;'
        if ($newContent -ne $content) {
            Set-Content $path $newContent -NoNewline
            Write-Host "Reverted (pattern1): $f"
        }
    }
}

foreach ($f in $pattern2Files) {
    $path = Join-Path $dir $f
    if (Test-Path $path) {
        $content = Get-Content $path -Raw
        $newContent = $content -replace [regex]::Escape('!data?.personalInfo;'), '!data?.personalInfo?.name && !data?.personalInfo?.fullName;'
        if ($newContent -ne $content) {
            Set-Content $path $newContent -NoNewline
            Write-Host "Reverted (pattern2): $f"
        }
    }
}

foreach ($f in $pattern3Files) {
    $path = Join-Path $dir $f
    if (Test-Path $path) {
        $content = Get-Content $path -Raw
        $newContent = $content -replace [regex]::Escape('!data?.personalInfo;'), '!data?.personalInfo?.fullName && !data?.personalInfo?.name;'
        if ($newContent -ne $content) {
            Set-Content $path $newContent -NoNewline
            Write-Host "Reverted (pattern3): $f"
        }
    }
}

Write-Host "Done"

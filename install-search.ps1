$ErrorActionPreference = 'Stop'
$path = 'src/components/layout/Header.tsx'
if (!(Test-Path $path) -or !(Test-Path 'package.json')) { throw 'Run from the project root.' }
$utf8 = [System.Text.UTF8Encoding]::new($false)
$full = Join-Path (Get-Location) $path
$s = [System.IO.File]::ReadAllText($full)
if ($s.Contains('BSU_SEARCH_PANEL')) { Write-Host 'Search already integrated.'; exit 0 }
$old = $s
$s = $s.Replace('import { useMemo, useState } from "react";', 'import { useEffect, useState } from "react";' + "`n" + 'import dynamic from "next/dynamic";')
$s = $s.Replace('export default function Header() {', 'const BSUSearchPanel = dynamic(() => import("@/components/search/SearchExperience"), { ssr: false });' + "`n" + 'export default function Header() {')
$s = $s.Replace('  const [query,setQuery] = useState("");','')
$start = $s.IndexOf('  const matches = useMemo(')
$end = $s.IndexOf('  return <>', $start)
if ($start -lt 0 -or $end -lt 0) { throw 'Header differs from expected version. No changes written.' }
$effect = @'
  useEffect(() => {
    const key = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault(); setSearchOpen(open => !open);
      }
      if (event.key === "Escape") setSearchOpen(false);
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, []);
'@
$s = $s.Substring(0,$start) + $effect + "`n" + $s.Substring($end)
$start = $s.IndexOf('      {searchOpen&&')
$end = $s.IndexOf('      {mobileOpen&&',$start)
if ($start -lt 0 -or $end -lt 0) { throw 'Search panel not found. No changes written.' }
$panel = @'
      {/* BSU_SEARCH_PANEL */}
      {searchOpen && <div className="border-t border-slate-100 bg-white px-5 py-4 shadow-md"><div className="mx-auto max-w-4xl"><BSUSearchPanel compact onNavigate={() => setSearchOpen(false)} /></div></div>}
'@
$s = $s.Substring(0,$start) + $panel + "`n" + $s.Substring($end)
if (!$s.Contains('import dynamic') -or !$s.Contains('const BSUSearchPanel') -or $s.Contains('useMemo') -or $s.Contains('setQuery')) { throw 'Unexpected Header structure; no changes written.' }
$backup = Join-Path $env:TEMP ('bsu-header-' + [guid]::NewGuid().ToString() + '.tsx')
[System.IO.File]::WriteAllText($backup,$old,$utf8)
[System.IO.File]::WriteAllText($full,$s,$utf8)
Write-Host "BSU Search integrated. Header backup: $backup"

$files = @(
    "C:\Users\Gael\.gemini\extensions\caveman\agents\cavecrew-builder.md",
    "C:\Users\Gael\.gemini\extensions\caveman\agents\cavecrew-investigator.md",
    "C:\Users\Gael\.gemini\extensions\caveman\agents\cavecrew-reviewer.md"
)
foreach ($f in $files) {
    if (Test-Path $f) {
        $content = Get-Content $f
        $content = $content -replace "Read", "read_file"
        $content = $content -replace "Edit", "replace"
        $content = $content -replace "Write", "write_file"
        $content = $content -replace "Grep", "grep_search"
        $content = $content -replace "Glob", "glob"
        $content = $content -replace "Bash", "run_shell_command"
        $content | Set-Content $f
        Write-Host "Updated $f"
    } else {
        Write-Warning "File not found: $f"
    }
}

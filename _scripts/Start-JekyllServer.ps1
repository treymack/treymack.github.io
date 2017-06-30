param (
    [Switch]
    $IncludeDrafts
)
if ($IncludeDrafts) {
    $drafts = "--drafts"
} else {
    $drafts = ""
}

vagrant ssh -c "cd /vagrant && jekyll serve --watch --host 0.0.0.0 --force_polling $drafts"

git add .
git commit -m "$1"
git tag "v$2"
git push origin main "v$2"
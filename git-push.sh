git add .
git commit -m "$1"
git push origin main
git tag "v$2"
git push origin "v$2"
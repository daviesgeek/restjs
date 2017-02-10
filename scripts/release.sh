npm run local-test
npm run build
node_modules/.bin/json -I -f package.json -e 'this.version="'$@'"'
npm run docs
mv "docs/restjs/$@" "docs/$@"
rm -rf docs/restjs
cat docs/latest/index.template.md > docs/latest/index.md
echo "<script>window.location = '/$@'</script>" >> docs/latest/index.md
git add "docs"
git commit -m "Added docs for $@"
echo "All done. Don't forget to update the changelog, commit, tag and push!"
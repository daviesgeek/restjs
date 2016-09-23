npm run local-test
npm run build
node_modules/.bin/json -I -f package.json -e 'this.version="'$@'"'
npm run docs
mv "docs/restjs/$@" "docs/$@"
rm -rf docs/restjs
git checkout gh-pages
cp -R "docs/$@/*" docs
git add "docs"
git commit -m "Added docs for $@"
git checkout master
echo "All done. Don't forget to update the changelog, commit, tag and push!"
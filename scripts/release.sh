npm run local-test
npm run build
node_modules/.bin/json -I -f package.json -e 'this.version="'$@'"'
echo "All done. Don't forget to update the changelog, commit, tag and push!"
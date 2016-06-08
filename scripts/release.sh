npm run test
npm run build
node_modules/.bin/json -I -f package.json -e 'this.version="'$@'"'
git tag $@
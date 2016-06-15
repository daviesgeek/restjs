# Keep in mind that this runs with all the node_module/.bin binaries (see https://docs.npmjs.com/cli/run-script)

# Get the current version
VERSION=$(json -f package.json version)

# Make the dist folder and clear it if necessary
mkdir -p dist
rm -rf dist/*

# First, compile the source using babel
cat src/rest.js | babel --presets es2015 --out-file dist/rest.js

# And add the version number
echo "Rest.VERSION = '$VERSION'" >> dist/rest.js

# Create the polyfill version
cat ./node_modules/babel-polyfill/dist/polyfill.js >> dist/rest.polyfill.js
cat dist/rest.js >> dist/rest.polyfill.js

# Create a minified version of both dist files
uglifyjs --mangle --output dist/rest.min.js -- dist/rest.js
uglifyjs --mangle --output dist/rest.polyfill.min.js -- dist/rest.polyfill.js
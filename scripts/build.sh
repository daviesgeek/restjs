# Keep in mind that this runs with all the node_module/.bin binaries (see https://docs.npmjs.com/cli/run-script)

# Get the current version
VERSION=$(json -f package.json version)

if [ -z "$CIRCLE_ARTIFACTS"]; then
  DIST_FOLDER='dist'
else
  DIST_FOLDER=$CIRCLE_ARTIFACTS
fi

# Make the dist folder and clear it if necessary
rm -rf "$DIST_FOLDER"
mkdir -p $DIST_FOLDER

echo 'Compiling with Babel...               \r\c'
# First, compile the source using babel
cat src/rest.js | babel --presets es2015 --out-file "$DIST_FOLDER/rest.js"

# And add the version number
echo "Rest.VERSION = \"$VERSION\"" >> "$DIST_FOLDER/rest.js"

echo 'Adding polyfill versions...           \r\c'

# Create the polyfill version
cat ./node_modules/babel-polyfill/dist/polyfill.js >> "$DIST_FOLDER/rest.polyfill.js"
cat "$DIST_FOLDER/rest.js" >> $DIST_FOLDER/rest.polyfill.js""

echo 'Compiling Node version...             \r\c'
cp $DIST_FOLDER/rest.js $DIST_FOLDER/rest.node.js
echo "export default Rest;" >> "$DIST_FOLDER/rest.node.js"

echo 'Minifying...                          \r\c'
# Create a minified version of both dist files
uglifyjs --mangle --output "$DIST_FOLDER/rest.min.js" -- "$DIST_FOLDER/rest.js"

echo 'Adding polyfill to minified version...\r\c'
cp "$DIST_FOLDER/rest.polyfill.js" "$DIST_FOLDER/rest.polyfill.min.js"
cat ./node_modules/babel-polyfill/dist/polyfill.min.js >> "$DIST_FOLDER/rest.polyfill.min.js"

echo 'Finished build!                       \n'
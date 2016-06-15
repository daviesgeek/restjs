# Keep in mind that this runs with all the node_module/.bin binaries (see https://docs.npmjs.com/cli/run-script)

# Get the current version
VERSION=$(json -f package.json version)

if [ -z "$CIRCLE_ARTIFACTS"]; then
  DIST_FOLDER='dist'
else
  DIST_FOLDER=$CIRCLE_ARTIFACTS
fi


# Make the dist folder and clear it if necessary
mkdir -p $DIST_FOLDER
rm -rf "$DIST_FOLDER/*"


# First, compile the source using babel
cat src/rest.js | babel --presets es2015 --out-file "$DIST_FOLDER/rest.js"

# And add the version number
echo "Rest.VERSION = \"$VERSION\"" >> "$DIST_FOLDER/rest.js"

# Create the polyfill version
cat ./node_modules/babel-polyfill/dist/polyfill.js >> "$DIST_FOLDER/rest.polyfill.js"
cat "$DIST_FOLDER/rest.js" >> $DIST_FOLDER/rest.polyfill.js""

# Create a minified version of both dist files
uglifyjs --mangle --output "$DIST_FOLDER/rest.min.js" -- "$DIST_FOLDER/rest.js"
uglifyjs --mangle --output "$DIST_FOLDER/rest.polyfill.min.js" -- "$DIST_FOLDER/rest.polyfill.js"
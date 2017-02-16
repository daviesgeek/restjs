#CHANGELOG

## Unreleased

### Added
Added the option for `Element.get()` to pass a route and/or params

## 1.1.0 - 2017-02-10

***BREAKING***: Added collection transformer as option for `Rest.factory`
This change will break backwards compatibility for anything using `Rest.factory` as the method signature has changed.

### Added
Added new default options to the config
 - Default parameters
Added `xhr` parameter to response interceptors
Added request interceptors
Added `post` and `customPOST` on `Rest.factory`

### Fixed
Fixes to the build script:
 - Already minified Babel polyfill is being added to the already minified dist file, rather than adding the polyfill and minifying both
 - Now correctly clears the dist folder

## 1.0.2 - 2016-08-31
Updated to possibly work with Node. This will _not_ work without an `XMLHttpRequest` polyfill for Node

## 1.0.1 - 2016-06-14
Fixed problem with only resolving 200s. Oops.  
Added test coverage for said status code problem.  
Now includes (optionally) polyfill and minified versions  

## 1.0.0 - 2016-06-13
Initial release

<!---  

## Version

### Added
For new features.

### Changed
For changes in existing functionality.

### Deprecated
For once-stable features removed in upcoming releases.

### Removed
For deprecated features removed in this release.

### Fixed
For any bug fixes.

### Security
To invite users to upgrade in case of vulnerabilities.



From: http://keepachangelog.com/

--->
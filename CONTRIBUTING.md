# Contributing

Thanks for taking the time to contribute to this project.

## Bug Reports
If you think you've found a bug, please first search [the issues list](@todo) before opening an issue.

### Writing A Bug Report

If you haven't found an existing issue, take some time to follow some simple guidelines for writing the issue:

- Use a **clear and descriptive title** for the issue.
- If possible use [this Plunker **template**](@todo) to show the problem. Or, submit a failing unit test (Read about [how to run tests](@todo)).
- **Describe** how you encountered the bug with as much detail as possible. For instance, make sure you include OS and browser versions, as well as code snippets to demonstrate the issue.

## Pull Requests

If you'd like to submit a pull request, there are a couple more things to add:

- Please make sure you update surrounding comments in the code you changed. All comments are written in [JSDoc](http://usejsdoc.org/) format. PRs will not be merged in without valid JSDoc comments (run `npm run docs` to confirm & to rebuild the docs).
- Please add a note under "Unreleased" in [CHANGELOG.md](@todo) to note your changes (see the comments in the changelog for more details)
- Make sure unit tests aren't failing (Read about [how to run tests](@todo)).
  - If you added functionality, please add test coverage to verify the expected behavior of new features.
- Don't update the dist folder in your PR. Leave that for the release stage

### Coding Conventions

- No trailing whitespace.
- Indent using two spaces (not tabs; soft tabs).
- Always have a space before an opening bracket: 

```js 
if(thing == true){} // Not like this

if(thing == true) { // Like this!
  // Thing is true! Woohoo!!
}

for(var key in object) { // and this!
  // Monkey, donkey, pinkey, hockey, turkey…oh wait, not those kinds of keys?
}
```

- Similarly, always put a space between operators:

```js

// Nasty!
let sum = 1+foo+bar+73

// Much better!
let sum = 1 + foo + bar + 72
```

- Omit brackets on single line-if statements for cleaner code:

```js
if(thing == true)
  console.log('thing is true!')
else
  console.log('thing is false!')

```

- No need to elimate commas in lists:

```js

let doctors = {
  "Capaldi": "Peter",
  "Smith": "Matt",
  "Tennant": "David",
  "Eccleston": "Christopher", // leave the trailing comma here;
  // it makes it easier to rearrange lists, and you don't have to worry about adding or removing the comma!
}

```
# Solidarity Options
Understanding the `.solidarity` file helps you read and write new solidarity checks for any project.

## `.solidarity` Rules
The `.solidarity` file is a JSON object with a set of rules to enforce on each computer's environment.

Each type of check is dictated by the `rule` property.  Depending on the `rule` is what other properties will be required

### `"rule"="cli"`

A CLI rule will investigate to make sure a specific CLI is installed on the system.  The contents of whatever is passed to `binary`, global or path, will be checked for existence.

*e.g.* This will check that yarn exists
```json
"Yarn": [{ "rule": "cli", "binary": "yarn" }]
```

To check a version, you can tell us how to identify the version, or we can guess.  Depending on the tool, guessing might not be the best option.  Our guesses will run `-v`, `--version` and `-version` against your binary, and look for the first semantic version in the output.

*e.g.* Check that yarn ^4.1.2 is installed
```json
"NPM": [{ "rule": "cli", "binary": "npm", "semver": "^1.0.1" }]
```

To enforce and speed up version checking you can set the `version` property with the proper command.

*e.g.* Yarn will do installs if it gets `-v` so specify correct way!
```json
"Yarn": [{ "rule": "cli", "binary": "yarn", "version": "--version", "semver": "^0.27.5" }]
```

Sometimes the first semantic version is not the correct one.  So you can specify how to find the version by setting the `line` property.  If the `line` is a number, it will look at that line number.  If it is a string, it will act like `grep`.  And if it is regex, it will return the result of your regular expression for parsing.  So basically pass whatever helps you find your version to `line` for multi-line version output.

*e.g.* React Native gives two versions
```sh
$ react-native -v
react-native-cli: 2.0.1
react-native: 0.48.1
```
To match against the second version we give line 2
```json
"React Native": [{ "rule": "cli", "binary": "react-native", "semver": "^0.48.1", "line": 2 }]
```

### `"rule"="env"`
`env` means we will check for the environment variable passed in the `variable` property.

### Friendly Errors
So what do we do if a rule fails?  The return code will be non-zero, but that's not the most friendly option.  You can set the `error` for any rule to give the user legible instruction on why the failure happened, and how they should solve it.

*e.g.* Prompt them to install the missing cli
```json
  "Watchman": [
    {
      "rule": "cli",
      "binary": "watchman",
      "error": "please install with `brew install watchman`"
    }
  ]
```

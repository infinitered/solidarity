# Solidarity Options
Understanding the `.solidarity` file helps you read and write new solidarity checks for any project.

## Solidarity output
You can use set the following option in `.solidarity` to configure output:
```
{
  "config" : {
    "output" : "<moderate/verbose/silent>"
  }
}
```
_Default is `moderate`_

- Moderate - Only outputs message if a specific check fails
- Verbose  - Outputs all messages for successful and failed checks.
- Silent   - No visible output, just have to see system return value (mostly for turning down CI noise).

Optionally you can also pass `--verbose`, `--moderate`, or `--silent` in the CLI to override the configuration option change the output.

## Solidarity Rules
The `.solidarity` file is a JSON object with a set of requirements to enforce on each computer's environment.  All requirements should be specified inside the `requirements` key.

Each type of requirement check is dictated by the `rule` property.  Depending on the `rule` is what other properties will be required

See [this file](../.solidarity.example) for an example of what a solidarity rule-set might look like for any given project.

### CLI Rules

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

*e.g.* Yarn < v1 installs if you pass `-v` so specify a correct way!
```json
"Yarn": [{ "rule": "cli", "binary": "yarn", "version": "--version", "semver": "^0.27.5" }]
```

Sometimes the first semantic version is not the correct one.  So you can specify how to find the version by setting the `line` property.  If the `line` is a number, it will look at that line number.  If it is a string, it will act like `grep`.  So basically pass whatever helps you find your version to `line` for multi-line version output.

*e.g.* React Native version command outputs two versions. By default the first version is detected for rules.
```sh
$ react-native -v
react-native-cli: 2.0.1
react-native: 0.48.1
```
To match against the second version we can give `line` number:
```json
"React Native": [{ "rule": "cli", "binary": "react-native", "semver": "^0.48.1", "line": 2 }]
```
OR you could identify the `line` via string matching:
```json
"React Native": [{ "rule": "cli", "binary": "react-native", "semver": "^0.48.1", "line": "react-native:" }]
```

Lastly, if output has multiple versions, you can identify the index of the version you'd like by specifying a `matchIndex`.

### Environment Rules
`env` means we will check for the environment variable passed in the `variable` property.

### File Rules
`file` rule means for a given file passed in the `location` property, we will verify it exists.

### Directory Rules
`dir` (or `directory`) rule means for a given directory passed in the `location` property, we will verify it exists.

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

### Platform Specific Rules
Some rules are only essential for a given node platform.  You can identify these rules with passing the `"platform"` property on any rule.

A platform property takes a string or and array of strings that identify the platforms that rule pertains to.  Platforms can be any of the following: `["darwin", "freebsd", "linux", "sunos", "win32"]`

*e.g.* Rule only performs a check on Mac and Linux
```json
  "Watchman": [
    {
      "rule": "cli",
      "binary": "watchman",
      "error": "please install with `brew install watchman` or whatever friendly package management service you use.",
      "platform": ["darwin", "linux"]
    }
  ]
```

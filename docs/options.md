# Solidarity File Options
Understanding the `.solidarity` file helps you read and write new solidarity checks for any project.

If you'd like to get auto-complete, or validation of your JSON rules, you can optionally add the following line to the `.solidarity` file for help in your personal editor.
```json
{
  "$schema": "http://json.schemastore.org/solidaritySchema",
}
```

## Solidarity is Powered by JSON5
Solidarity is happy to be supporting [JSON5](http://json5.org/) so your hand-written JSON can the friendliest experience possible.  That means you can include comments, skip quoting keys, and even leave dangling commas.  Automatic-snapshots are written regular JSON for backwards compatibility, so keep in mind a snapshot will erase these niceties.

## Solidarity output
You can use set the following option in `.solidarity` to configure output:
```json
{
  "config" : {
    "output" : "moderate"
  }
}
```
_Default is `moderate`_

- `moderate` - Only outputs message if a specific check fails
- `verbose`  - Outputs all messages for successful and failed checks.
- `silent`   - No visible output, just have to see system return value (mostly for turning down CI noise).

Optionally you can also pass `--verbose`, `--moderate`, or `--silent` in the CLI to override the configuration option change the output.

## Solidarity Rules
The `.solidarity` file is a JSON object with a set of requirements to enforce on each computer's environment.  All requirements should be specified inside the `requirements` key.

Each type of requirement check is dictated by the `rule` property.  Depending on the `rule` is what other properties will be required

See [this file](../.solidarity.example.json) for an example of what a solidarity rule-set might look like for any given project.

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

### Shell Rules
`shell` allows you to run a shell command and match some expected output from it's output. This is useful for

*e.g.* This checks to see if you have configured git with your email address.
```json
  "git email": [{
    "rule": "shell",
    "command": "git config user.email",
    "match": ".+@.+"
  }]
```

### Friendly Errors

So what do we do if a rule fails? The return code will be non-zero, but that's not the most friendly option. You can set the `error` for any rule to give the user legible instruction on why the failure happened, and how they should solve it.

_e.g._ Prompt them to install the missing CLI

```json
  "Watchman": [
    {
      "rule": "cli",
      "binary": "watchman",
      "error": "please install with `brew install watchman`"
    }
  ]
```

In your error message, you can include `{{wantedVersion}}` and `{{installedVersion}}` to give the user version information, or even to customize scripts to help them install or update.

```json
  "Yarn": [
    {
      "rule": "cli",
      "binary": "yarn",
      "error": "You have yarn@{{installedVersion}}, and need yarn@{{wantedVersion}}. Fix with `npm install -g yarn@{{wantedVersion}}`"
    }
  ]
```

### Platform Specific Rules

Some rules are only essential for a given node platform. You can identify these rules with passing the `"platform"` property on any rule.

A platform property takes a string or and array of strings that identify the platforms that rule pertains to. Platforms can be any of the following: `["darwin", "macos", "freebsd", "linux", "sunos", "win32", "windows"]`

_e.g._ Rule only performs a check on Mac and Linux

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

### Rule Fixes

Many times rules can be fixed in an automated manor. You can supply a script by passing the `"fix"` property on any rule. The fix will only be ran if the `--fix` flag is passed and only against failing rules. Any script errors will surface should it fail.

_e.g._ Rule provides fix to install yarn if not found (only ran if passing `--fix` option)

```json
  "Yarn": [
    {
      "rule": "cli",
      "binary": "yarn",
      "fix": "brew install yarn"
    }
  ]
```
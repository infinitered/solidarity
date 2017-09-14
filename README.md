![solidarity logo](./_art/solidarity-logo.png)
-----

An environment checking tool for verifying dependencies across machines for their dependant projects.

Package management `.lock` files help zero in on project dependencies, but some tech stacks need so much more! Look at React Native which needs a specific Android SDK, Pods, Xcode, node, & even versions of NPM and Yarn.  Solidarity is the perfect tool for making sure your team is sharing the same complex environment without the sharing the same environment complexity.

![solidarity action](./_art/action-shot.png)

## How do I use it?
Most of the time you'll just be typing the base command, to check your environment.
```sh
$ solidarity
```
This command looks for the `.solidarity` file in the working directory, and then runs a checking rules against your environment.  The command exit code is tied to the success of solidarity check.

Updates to your environment can be stored easily.
```sh
$ solidarity snapshot
```
Snapshot will update the rules in the `.solidarity` file to fit the current system specs.  If no `.solidarity` file is present, then you are prompted to snapshot the environment variables that fit whatever technology your project depends on.

# Solidarity Options
By default a snapshot will be strict with the versions of _everything_ detected.  But, semantic versioning is supported.

## `.solidarity` Rules
The `.solidarity` file is a JSON object with a set of rules to enforce on each computer's environment.

Each type of check is dictated by the `rule` property.  Depending on the `rule` is what other properties will be required

### `"rule"="cli"`

A CLI rule will investigate to make sure a specific CLI is installed on the system.  The contents of whatever is passed to `binary`, global or path, will be checked for existence.

*e.g.* This will check that yarn exists
```
"Yarn": [{ "rule": "cli", "binary": "yarn" }]
```

To check a version, you can tell us how to identify the version, or we can guess.  Depending on the tool, guessing might not be the best option.  Our guesses will run `-v`, `--version` and `-version` against your binary, and look for the first semantic version in the output.

*e.g.* Check that yarn ^4.1.2 is installed
```
"NPM": [{ "rule": "cli", "binary": "npm", "semver": "^1.0.1" }]
```

To enforce and speed up version checking you can set the `version` property with the proper command.

*e.g.* Yarn will do installs if it gets `-v` so specify correct way!
```
"Yarn": [{ "rule": "cli", "binary": "yarn", "version": "--version", "semver": "^0.27.5" }]
```

Sometimes the first semantic version is not the correct one.  So you can specify how to find the version by setting the `line` property.  If the `line` is a number, it will look at that line number.  If it is a string, it will act like `grep`.  And if it is regex, it will return the result of your regular expression for parsing.

*e.g.* React Native gives two versions, take the second line for our check
```
"React Native": [{ "rule": "cli", "binary": "react-native", "semver": "^0.48.1", "line": 2 }]
```

### `"rule"="env"`
`env` means we will check for the environment variable passed in the `variable` property.

### Friendly Errors
So what do we do if a rule fails?  The return code will be non-zero, but that's not the most friendly option.  You can set the `error` for any rule to give the user legible instruction on why the failure happened, and how they should solve it.

*e.g.* Prompt them to install the missing cli
```
  "Watchman": [
    {
      "rule": "cli",
      "binary": "watchman",
      "error": "please install with `brew install watchman`"
    }
  ]
```

## Supported Systems
Currently solidarity only works with Mac OSX.  Functionality for Windows OS is in the works.  Please submit PRs.

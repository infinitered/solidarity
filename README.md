# solidarity
React Native tool for verifying dependencies across machines for a project

Yarn and NPM have locked down the crazy mess of dependencies for JavaScript, but a React Native stack has so much more.  Android SDK, Pods, Xcode, hell, even versions of NPM and Yarn.  This tool is for making sure your team is sharing the same complex environment of dependencies.

## Usage
```sh
$ solidarity
```
This command looks for the `.solidarity` file in the working directory, and then runs a checking rules against your environment.  The command exit code is tied to the success of solidarity check.


```sh
$ solidarity snapshot
```
Snapshot will update the rules in the `.solidarity` file to fit the current system specs.  If no `.solidarity` file is present, then this command will attempt to verify if you have any environment plugins you would like to use.

# Solidarity Options
By default a snapshot will be strict with the versions of _everything_ detected.  But, semantic versioning is supported.

## `.solidarity` Rules
The `.solidarity` file is a JSON object with a set of rules to enforce on each computer's environment.

Here's an example `.solidarity` configuration that enforces 3 CLI tools:
```
FART NOISE
```
The type of check is dictated by the `rule` property.  Depending on the `rule` is what other properties will be required

### `"rule"="cli"`

A CLI rule will investigate to make sure a specific CLI is installed on the system.  The contents of whatever is passed to `binary`, global or path, will be checked for existence.

*e.g.* This will check that yarn exists
```
"Yarn": [{ "rule": "cli", "binary": "yarn" }]
```

To check a version, you must tell us how to identify the version.  You can do this with the `version` property.  We will then parse the output for the first semantic version.



*e.g.* Check that yarn ^1.0.1 is installed
```
"Yarn": [{ "rule": "cli", "binary": "yarn", "version": "yarn --version", "semver": "^1.0.1" }]
```

### `"rule"="env"`
**env** - This means we will check for the environment variable passed in the `variable` property.

## Supported Systems
Currently solidarity only works with Mac OSX.  Functionality for Windows OS is in the works.  Please submit PRs.


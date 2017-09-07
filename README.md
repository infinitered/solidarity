# solidarity
React Native tool for verifying dependencies across machines for a project

Yarn and NPM have locked down the crazy mess of dependencies for JavaScript, but a React Native stack has so much more.  Android SDK, Pods, Xcode, hell, even versions of NPM and Yarn.  This tool is for making sure your team is sharing the same complex environment of dependencies.

## Usage
```sh
$ solidarity
```
This command looks for the `.solidarity` file in the working directory, and then runs a check against all your environment.  The command exit code is tied to the success of solidarity check.


```sh
$ solidarity snapshot
```
Snapshot, will check your current environment and create a `.solidarity` file with the detected setup.  Once the file is created, you can edit it if any portion of the snapshot inconsiquential to your project needs.


## Solidarity Options
By default a snapshot will be strict with the versions of _everything_ detected.  But, semantic versioning is supported.

## Supported Systems
Currently solidarity only works with Mac OSX.  Functionality for Windows OS is in the works.  Please submit PRs.


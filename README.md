![solidarity logo](./_art/combo.jpg)
<p align="center">
  <h3>Solidarity is an environment checker for project dependencies across multiple machines.</h3>
</p>

#### Why?
Package management `.lock` files help zero-in on dependencies, but some stacks need more! For example, React Native needs specific Android SDK, Pods, Xcode, node, & even versions of NPM and Yarn.  Solidarity is the perfect tool for making sure your team is sharing the same complex environment without the environment complexity.

## How do I use it?
Most of the time you'll just be typing the base command, to check your environment.
```sh
$ solidarity
```
This command looks for the `.solidarity` file in the working directory, and then runs a check of the containing rules against your environment.  The command exit code is tied to the success of solidarity check.

Updates to your environment can be stored easily.
```sh
$ solidarity snapshot
```
Snapshot will update the rules in the `.solidarity` file to fit the current system specs.  If no `.solidarity` file is present, then you are prompted to snapshot the environment variables that fit whatever technology your project depends on.

By default a snapshot will be strict with the versions of _everything_ detected.  But, semantic versioning is supported.

Read [Options Documentation](./docs/options.md) for more options on the contents and rules of a solidarity file.

## Supported Systems
Currently solidarity only works with Mac OSX.  Functionality for Windows OS is in the works.  Please submit PRs.

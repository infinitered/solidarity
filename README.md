![solidarity logo](./_art/combo.jpg)
<p align="center">
  <h3>Solidarity is an environment checker for project dependencies across multiple machines.</h3>
</p>

**WHY?** Package management `.lock` files help zero-in on dependencies, but some stacks need more! For example, React Native needs specific Android SDK, Pods, Xcode, node, & even versions of NPM and Yarn.  Solidarity is the perfect tool for making sure your team is sharing the same complex environment without the environment complexity.

## How do I use it?
Using solidarity is the easiest part.  Type the base command to check the project environment
```sh
$ solidarity
```
This command looks for the `.solidarity` file in the working directory, and then runs a check of the containing rules against your environment.  The command exit code is tied to the success of solidarity check so for testing frameworks.

## How do I update it?
Environment updates can be stored to solidarity quickly with one command.
```sh
$ solidarity snapshot
```
Snapshot will update the rules in the `.solidarity` file to fit the current system specs.

By default a snapshot will be strict with the versions of _everything_ detected.  But, semantic versioning is supported.

## How do I create my first snapshot?
If no `.solidarity` file is present, then `solidarity snapshot` prompts you to identify the technology your project depends on.

Custom rule-sets can be created by modifying the `.solidarity` file by hand, or by creating a solidarity plugin for a given technology.  See documentation for how you can create your own.

### Docs
* [Solidarity Rules Options](./docs/options.md)
* [Solidarity Technology Plugins](./docs/plugins.md)

## Supported Systems
Currently solidarity only works with Mac OSX.  Functionality for Windows OS is in the works.  Please submit PRs.

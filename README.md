<p align="center">
  <img src="https://raw.githubusercontent.com/infinitered/solidarity/master/_art/combo.jpg" width="700px" />
  <h3 align="center">Solidarity is an environment checker for project dependencies across multiple machines.</h3>
  <hr/>
  
  <a href='https://www.npmjs.com/package/solidarity'> <img src='https://nodei.co/npm/solidarity.png?downloads=true&downloadRank=true&stars=true' alt="npm"> </a>
  
<a href='https://semaphoreci.com/ir/solidarity'> <img src='https://semaphoreci.com/api/v1/ir/solidarity/branches/master/badge.svg' alt='Build Status'></a>
<a href='https://travis-ci.org/infinitered/solidarity'> <img src='https://travis-ci.org/infinitered/solidarity.svg' alt='Build Status'></a>
<a href="https://codecov.io/gh/infinitered/solidarity">
  <img src="https://codecov.io/gh/infinitered/solidarity/graph/badge.svg" alt="Codecov" />
</a>


</p>

**WHY DOES SOLIDARITY EXIST?** Package management `.lock` files help zero-in on dependencies, but some stacks need more! For example, React Native needs specific Android SDK, Pods, Xcode, node, & even versions of NPM and Yarn.  Solidarity is the perfect tool for making sure your team is sharing the same complex environment without worrying about the environment complexity.

### Docs
* [Solidarity Rules Options](/docs/options.md)
* [Write Solidarity Plugins](/docs/plugins.md)
* [Available Plugins](/docs/pluginsList.md)

## How do I use it?
Using solidarity easy! Run the command to check the current project environment
```sh
$ solidarity
```
This command looks for the `.solidarity` file in the working directory, and then runs a check of the containing rules against your environment.  The command exit code is tied to the success of solidarity check so for testing frameworks.

## How do I update it?
Environment updates can be stored to solidarity quickly.
```sh
$ solidarity snapshot
```
The `snapshot` parameter will update the rules in the `.solidarity` file to the current system specs. By default a snapshot will be strict with the versions of _everything_ detected.  But, semantic versioning is supported.

## How do I create my first snapshot?
If no `.solidarity` file is present, then `solidarity snapshot` prompts you to identify the technology your project depends on.

```sh
$ solidarity snapshot
No `.solidarity` file found for this project.  Would you like to create one? (Y/n)
```

Custom rule-sets can be created by modifying the `.solidarity` file by hand, or by creating a solidarity plugin for a given technology.  See documentation for how you can create your own.

### Install
Install command globally, OR use via `node_modules`.  It's suggested you install your snapshot plugins in the same place.

Note:
Node.js version must be >= `7.6.0`.
```sh
# example of installing global with npm and react-native snapshot
$ npm i -g solidarity solidarity-react-native

# example of installing local with yarn and elixir snapshot (dev dependencies)
$ yarn add soliarity solidarity-elixir --dev
```

## Supported Systems
Currently solidarity only works with Mac and Linux.  Functionality for Windows OS is in the works.  Please submit PRs.

## Premium Support
Solidarity, as open source, is free to use and always will be. [Infinite Red](https://infinite.red/) offers premium Solidarity support and general mobile app design/development services. Email us at [hello@infinite.red](mailto:hello@infinite.red) to get in touch with us for more details.

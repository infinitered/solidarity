<p align="center">
  <img src="https://raw.githubusercontent.com/infinitered/solidarity/master/_art/combo.jpg" width="700px" />
  <h3 align="center">Solidarity is an environment checker for project dependencies across multiple machines.</h3>
  <hr/>
<a href='https://semaphoreci.com/ir/solidarity'> <img src='https://semaphoreci.com/api/v1/ir/solidarity/branches/master/badge.svg' alt='Build Status'></a>
<a href='https://travis-ci.org/infinitered/solidarity'> <img src='https://travis-ci.org/infinitered/solidarity.svg' alt='Build Status'></a>
<a href="https://codecov.io/gh/infinitered/solidarity">
  <img src="https://codecov.io/gh/infinitered/solidarity/graph/badge.svg" alt="Codecov" />
</a>
<a href="https://badge.fury.io/js/solidarity"><img src="https://badge.fury.io/js/solidarity.svg" alt="npm version" height="18"></a>

</p>


### WHY DOES SOLIDARITY EXIST:question:
I know the one-liner under the graphic isn't for everyone.  If you'd like a quick, friendly explanation, please take a two minutes to read [the announcement blog post](https://medium.com/@gantlaborde/solidarity-the-cli-for-environment-sanity-672fa81b98e9)

### Docs Page
https://infinitered.github.io/solidarity/

-------
_We now return you to your regularly scheduled ReadMe_

## Install
Install command globally, OR use via `node_modules`.  It's suggested you install your snapshot plugins in the same place.

Note:
Node.js version must be >= `7.6.0`.
```sh
# example of installing global with npm and react-native snapshot
$ npm i -g solidarity solidarity-react-native

# example of installing local with yarn and elixir snapshot (dev dependencies)
$ yarn add soliarity solidarity-elixir --dev
```

## How do I use it?
Using solidarity easy! Run the command to check the current project environment
```sh
$ solidarity
```
This command looks for the `.solidarity` file in the working directory, and then runs a check of the containing rules against your environment.  The command exit code is tied to the success of solidarity check so for testing frameworks.

## How do I update it to my machine specs?
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

## Supported Systems
Currently solidarity only works with Mac and Linux.  Functionality for Windows OS is in the works.  Please submit PRs.

## Support

#### Open Source
Solidarity, as open source, is free to use and always will be.  It's MIT Licensed and we'll always do our best to help and quickly answer issues.  If you'd like to get a hold of us, join our [community slack](http://community.infinite.red) and look for the #solidarity room.
#### Premium
[Infinite Red](https://infinite.red/) offers premium Solidarity support and general mobile app design/development services. Email us at [hello@infinite.red](mailto:hello@infinite.red) to get in touch with us for more details.

## Additional Info
[![NPM](https://nodei.co/npm/solidarity.png)](https://npmjs.org/package/solidarity)

## License
The MIT License (MIT). Please see [License File](LICENSE.md) for more information.


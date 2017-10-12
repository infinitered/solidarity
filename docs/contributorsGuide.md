# How do I get started contributing?

## A moment before you start contributing
Be sure to mention that you're going to take on a task on the designated issue [on Github](https://github.com/infinitered/solidarity/issues).  If there is no issue on Github, please create one first.  This will limit the number of people who accidentally create PRs that do not fit the roadmap of the tool

## Running Locally
To test this project, you'll need to pull it down and configure your local system to run the development version of Solidarity.  We've made this as simple as possible!

**To get started**
* Pull down project to your local machine
* `cd` into project root
* Run `yarn` to install dependencies
* Run `yarn welcome` to install the Solidarity CLI

You can now type `solidarity` and it is running from the compiled TypeScript in your local project.

### Updating Local Code
Whenever you have modified the `/src` folder, you can run `yarn tsc` to compile the typescript into JS, and your global `solidarity` CLI will be updated.

### Working with Plugins
If you're building your own plugin, you can begin your project, and then install it to any test-project by the path with `yarn add`.

_e.g._
```sh
$ yarn add ~/playground/solidarity-fiesta
```

**OR** you can modify your local Solidarity to look for a special plugin directory by chaining the `plugin` function onto the `build()` results in index.

_e.g._
```js
module.exports = async () => {
  // setup the runtime
  build()
    .brand('solidarity')
    .src(__dirname)
    .plugins('./node_modules', { matching: 'solidarity-*', hidden: true })
    // I'm testing here!!!! non-permanent
    .plugin('../solidarity-fiesta')
    .create()
    .run()
}
```

Both of these options allow you to quickly iterate on your plugin.  For more information on how to create Solidarity plugins please see [plugins.md](plugins.md)

## Submitting a PR
Here's a friendly checklist for submitting your PR
1. Make sure any extraneous files (_i.e._ build dependencies, IDE configs, etc.) are removed or added to the `.gitignore`
1. Make sure any files non-critical to the package are added to the `.npmignore`
1. Update docs with details of changes to the interface.  This includes public interfaces, file locations, or changes in parameters.
1. Make sure you have tests covering your new or changed functionality.
1. Make sure `yarn test` passes.  Otherwise, your PR cannot be merged.
1. Reference your Gihub issue in your final PR

## The Simplest Plugin

### Example Problem
Most of the time the plugin you're going to write will be so _dead simple_ that the art is in the rule set alone.

Let's pretend we're working with a technology called Fiesta and this is our plugin rule-set:
```json
"Fiesta": [
    { "rule": "cli", "binary": "nachos" },
    { "rule": "cli", "binary": "tacos" },
    { "rule": "env", "variable": "HEART_SURGEON" }
]
```
_We have 1 requirement that has 3 rules. 2 CLIs to check, and 1 environment variable to verify the Fiesta is on._

To learn more about writing rules, take a look at Solidarity [options here](options.md).

You may notice we haven't specified `semver` for any CLIs because, that's kinda personal to the project.  **No problem!** we can place a holder at `0.0.0` and ask for a fresh snapshot of local versions.  This will upgrade those numbers to whatever is currently working for that project.

```json
"Fiesta": [
    { "rule": "cli", "binary": "nachos", "semver": "0.0.0" },
    { "rule": "cli", "binary": "tacos", "semver": "0.0.0" },
    { "rule": "env", "variable": "HEART_SURGEON" }
]
```

> So our plugin needs to do 2 things: copy our rules, and then run snapshot... that's it.

### Example Plugin Solution
We need 2 folders, and 2 files.
```
extensions/
  |
  | _ fiesta.js

templates/
  |
  | _ fiesta-template.json
```
> **WARNING:** `extensions` folder must only contain extensions.  Don't add spurious files here.

As you may have guessed `fiesta-template.json` is our copy of the rule-set we designed above.  `fiesta.js` is going to be how we register our plugin with Solidarity, and copy that file.

Contents of `fiesta.js`
```js
module.exports = (context) => {
  // Register this plugin
  context.addPlugin({
    name: 'Fiesta Time',
    description: 'Make sure your system is ready to party 🎉',
    snapshot: `fiesta-template.json`
  })
}
```

#### That's it!
We've written our plugin!  It was just 3 simple properties to get our plugin listed.  Once our file is copied over, `snapshot` will automatically be called, and our `0.0.0` versions will be stamped with whatever is on the system.

Let's review the 3 properties:

|  property   |                                                                            purpose                                                                             |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| name        | Name of plugin presented to user                                                                                                                               |
| description | Description given to user during listing of plugins.                                                                                                                |
| snapshot    | If type `string`, it is the file to copy as the `.solidarity` file, and must be located in the `templates` folder.  Otherwise it's the async function to run when this plugin is selected (_for intermediate plugins_) |

**Plugin written!**  Now you can publish your plugin to `npm`.

Just make sure that it starts with `solidarity-` so the CLI knows to pick it up.  We could publish our above plugin as `solidarity-fiesta` and when installed, our plugin would be listed as a Solidarity snapshot option.

#### Congratulations!
You can now write solidarity plugins for any tech stack.  Be sure to list your plugin [here](pluginsList.md).

### [More About Plugins](/docs/plugins.md)

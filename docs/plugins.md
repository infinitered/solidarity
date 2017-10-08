# Writing your Plugin
If you're using a technology that doesn't have a plugin, or if you'd just like build your on style, we've made creating plugins extremely simple.

## The Simplest Plugin
Most of the time the plugin you're going to write will be so _dead simple_ that the art is in the rule set alone.

Let's pretend this is our plugin rule-set:
```json
"Fiesta": [
    { "rule": "cli", "binary": "nachos" },
    { "rule": "cli", "binary": "tacos" },
    { "rule": "env", "variable": "HEART_SURGEON" }
]
```
_We have 1 requirement that has 3 rules. 2 CLIs to check, and 1 environment variable to verify the Fiesta is on._

To learn mor about writing rules, take a look at all [options here](options.md).

You may notice we haven't specified `semver` for any CLIs because, that's kinda personal to the project.  **No problem!** we can start at `0.0.0` and a fresh snapshot will upgrade those numbers to whatever is working for that project.

```json
"Fiesta": [
    { "rule": "cli", "binary": "nachos", "semver": "0.0.0" },
    { "rule": "cli", "binary": "tacos", "semver": "0.0.0" },
    { "rule": "env", "variable": "HEART_SURGEON" }
]
```

> So our plugin needs to do 2 things: copy our rules, and then run snapshot... that's it.

## Writing the Simplest Plugin
Plugins have the full power of Gluegun (the CLI helper) behind them, but for this plugin, you won't even need to take notice.

We need 2 folders, and 2 files.
```
extensions/
  |             |
  | _ fiesta.js |

templates/
  |                        |
  | _ fiesta-template.json |
```
> **WARNING:** `extensions` folder must only contain extensions.  Don't add spurious files here.

As you may have guessed `fiesta-template.json` is our copy of the rule-set we designed above.  `fiesta.js` is going to be how we register our plugin, and copy that file.

```js
module.exports = (context) => {
  // Register this plugin
  context.pluginsList.push({
    name: 'Fiesta Time',
    description: 'Make sure your system is ready to party',
    snapshot: `${__dirname}/../templates/fiesta-template.json`
  })
}
```

#### That's it!
We've written our plugin!  It was just 3 simple properties to get our plugin listed.  Once our file is copied over, `snapshot` will automatically be called, and our `0.0.0` versions will be stamped with whatever is on the system.

Let's review the 3 properties:

|  property   |                                                                            purpose                                                                             |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| name        | Name of plugin presented to user                                                                                                                               |
| description | Description given in listing of plugins to user                                                                                                                |
| snapshot    | If type `string` it is the file to copy as the `.solidarity` file.  Otherwise it's the async function to run when this plugin is selected (_for advanced plugins_) |

**Plugin written!**  Now you can publish your plugin to `npm`.

Just make sure that it starts with `solidarity-` so the CLI knows to pick it up.  We could publish our above plugin as `solidarity-fiesta` and when installed, our plugin would be listed as a snapshot option.

#### Congratulations!
You can now write solidarity plugins for any tech stack.

## The Advanced Plugin
File-copy is cute :heartpulse:, but perhaps you want to ask the user questions, read files, or even stamp your own versions.  All you need to do is provide an async function to the snapshot property, instead of a string.

Whatever async function you provide will be run when your plugin is selected.  Now writing the `.solidarity` file is up to you!

**And you're not alone!** You have full power of Gluegun's context API (the CLI driver of Solidarity).

Learn more about [Gluegun here](https://infinitered.github.io/gluegun/#/context-api).  Any spinner, color, or prompt you see in Solidarity is driven from the Gluegun context API.  So open up our source for examples!

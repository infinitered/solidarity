## Plugins that write Solidarity Files from Code

Perhaps you want to ask the user questions, read files, or even stamp your own versions. In the [Simple Plugin](/docs/simplePlugin.md) section we copy a template with our plugin.  File-copy is cute :heartpulse:, but this section will show you how to do more.  All you need to do is provide an async function to the snapshot property, instead of a string like the simple plugin used.

Whatever async function you provide will be run when your plugin is selected.  Now writing the `.solidarity` file is up to you!

**And you're not alone!** You have full power of Gluegun's context API (the CLI driver of Solidarity).

Learn more about [Gluegun here](https://infinitered.github.io/gluegun/#/context-api).  Any spinner, color, or prompt you see in Solidarity is driven from Gluegun.  So open up Solidarity source for examples of things you can do!

_As an example:_ If we wanted to perform the same exact plugin as the one from [Simple Plugin](/docs/simplePlugin.md), but do everything manually, the plugin would then look like this:

```js
module.exports = (context) => {
  // Register this plugin
  context.addPlugin({
    name: 'Fiesta Time',
    description: 'Make sure your system is ready to party 🎉',
    snapshot: async (context) => {
      const { filesystem, system } = context
      // Copy template
      filesystem.copy(
        `${__dirname}/../templates/fiesta-template.json`,
        '.solidarity'
      )
      // Update versions to local
      await system.run('solidarity snapshot')
    }
  })
}
```

### [More About Plugins](/docs/plugins.md)

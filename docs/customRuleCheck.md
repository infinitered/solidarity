## Custom Rule Check

If you'd like to create your own rule, this can be done as of Solidarity v1.2+.  This can be useful for any rule that cannot be easily constructed with the existing ruleset.  Custom rules reside in you solidarity file among all other rules, and require the following:

1. `rule` must be set to 'custom'
1. `plugin` prop  is present and set to the name of your plugin, and defined in your `addPlugin` function config.
1. `name` prop is present and set to the rule name you'd like to run.

*All other properties added to your rule can be used by your custom plugin.*

#### For example: A custom rule that always passes.
We add this rule to any requirement in our Solidarity file:
```json
{
  "rule": "custom",
  "plugin": "Always Pass",
  "name": "checkThing",
  "otherStuff": "nachos"
},
```

We will now create a plugin (in the location and structure identified in the Simplest Plugin section.)

We add the property `rules` which identifies custom rules, and give that object a property with the name that will match our rule name.

```js
module.exports = (context) => {
  // Register this plugin
  context.addPlugin({
    name: 'Always Pass',
    description: 'Example plugin that always passes',
    rules: {
      // Here's my rule name
      checkThing: {
        check: async (rule, context) => {
          return {
            pass: true,
            message: 'Yeah good check!'
          }
        }
      }
    }
  })
}
```

As you can see, our `checkThing` prop has a function `check` that is an async function with the `rule`, and the `context` provided.  The expected return is an object with two properties that answer "Did your custom check pass?"  And "What message should we display?"

>The message will only show for the appropriate user output setting.

If `check` were to return an object like:
```js
{
  pass: false,
  message: 'OH NO!'
}
```
Then the check would forever fail.

Inside your custom check function, you can perform any logic needed to identify and return a passing or failing state.

Install your own plugin and your rule will suddenly come to life!

### [More About Plugins](/docs/plugins.md)

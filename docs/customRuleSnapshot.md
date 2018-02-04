## Custom Rule Snapshot

As you know, when a user runs `solidarity snapshot` and existing `.solidarity` file is in place, the versions of rules get updated to that environment.  You can provide this same functionality in your custom plugin by implementing a `snapshot` function inside of your `rules` property.

> This is supported as of Solidarity v1.2+

We'll use the same rule (always pass) that was identified in the [custom rule check](/docs/customRuleCheck.md) section.

```json
{
  "rule": "custom",
  "plugin": "Always Pass",
  "name": "checkThing",
  "otherStuff": "nachos"
},
```

We will add an async function named `snapshot`

```js
module.exports = (context) => {
  // Register this plugin
  context.addPlugin({
    name: 'Always Pass',
    description: 'Example plugin that always passes',
    rules: {
      checkThing: {
        /*
        * commented out to keep focus
        * on snapshot for this section
        */
        // check: async (rule, context) => {
        //   return {
        //     pass: true,
        //     message: 'Yeah good check!'
        //   }
        // },
        snapshot: async (rule, context) => [
          {
            prop: 'semver',
            value: '12.0.0'
          },
          {
            prop: 'otherStuff',
            value: 'tacos'
          }
        ],
      }
    }
  })
}
```

As you can see, our `checkThing` now has a function named `snapshot` which is an async function with the `rule`, and the `context` provided.  The expected return is an array of objects with two properties.  The `prop` name, and `value` to set it to.

Inside your custom snapshot function, you can perform any logic needed to identify and return how to update the rule.

When our `snapshot` is run with the above, our original rule:
```json
{
  "rule": "custom",
  "plugin": "Always Pass",
  "name": "checkThing",
  "otherStuff": "nachos"
},
```

Will be updated: adding the prop `semver` and updating the prop `otherStuff`

```json
{
  "rule": "custom",
  "plugin": "Always Pass",
  "name": "checkThing",
  "otherStuff": "tacos",
  "semver": "12.0.0"
},
```

This helps round out the ability of your custom rule, to check AND update any number of props you choose.

### [More About Plugins](/docs/plugins.md)


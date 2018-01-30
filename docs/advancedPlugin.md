```json
    "CustomRequirement": [
      {
        rule: "custom",
        plugin: "My Plugin Name",
        name: "checkThing",
        otherStuff: "I like nachos"
      }
    ]
```

plugin
```js
const addOptionalRules = require('./helpers/addOptionalRules')

module.exports = (context) => {
  // Register this plugin
  context.addPlugin({
    name: 'My Plugin Name',
    description: 'I do amazing things',
    customChecks: {
      checkThing: async (rule, context) => {
        const successObject = {
          pass: true,
          message: 'Custom check succeeded!'
        }
        const failureObject = {
          pass: false,
          message: 'Custom check failed!'
        }

        // Randomly succeed or fail
        return !!Math.floor(Math.random() * 2) ? successObject : failureObject
      }
    }
  })
}
```

## Custom Rule Report

As you know, when a user runs `solidarity report` as of Solidarity 1.1+, a GitHub friendly report is generated to the screen.  You can provide this same functionality in your custom plugin by implementing a `report` function inside of your `rules` property.

> This is supported as of Solidarity v2+

You can add to any report table or create your own.  The known report tables are:
* basicInfo - Reports the system and report results
* cliRules - Report any system CLI results
* envRules - Report Environment Variable results
* filesystemRules - Report for existence of filesystem results
* shellRules - Report for any shell commands and their matches

There is another report called: **customRules** which holds tables created by custom plugins, which will show in the report.

**Let's do two examples:**
1. Example 1: Adding to the `cliRules` table
1. Example 2: Adding to the `customRules` array of tables

We'll use the same rule (always pass) that was identified in the [custom rule check](/docs/customRuleCheck.md) section.

We will add an async function named `report`

```js
module.exports = (context) => {
  // Register this plugin
  context.addPlugin({
    name: 'Always Pass',
    description: 'Example plugin that always passes',
    rules: {
      checkThing: {
        // report for your custom rule goes here
        report: async (rule, context, report) => {
          // CODE GOES HERE
        }
      }
    }
  })
}
```

Just like other custom rule sections, the function gets `rule`, and `context`.  Additionally the report object is passed into the function for mutation.  No return value is expected.

### Example 1: Adding to the `cliRules` table
Let's add to the CLI report.  The CLI report commonly has `Binary, Location, Version, Desired` as values, so pushing an array of 4 items will add a new row to your report.

```js
...
  report: async (rule, context, report) => {
    report.cliRules.push([
      'crazed_monkey',
      '/etc/useless/crazed_monkey',
      '10',
      '12'
    ])
  }
...
```

Now your row will show in the CLI section of the report.  As a bonus, there is a simple helper function attached to the report named `addCLI`, which takes an object with the props `binary`, `version`, and optionally `desired`.  It will then figure out the location for you, and if no desired is passed, the green `*ANY*` is shown.  The above report simplified with `addCLI` looks like so:

```js
...
  report: async (rule, context, report) => {
    report.addCLI({
      binary: 'crazed_monkey',
      version: '10'
    })
  }
...
```

The output inserts the results in the CLI section.
![crazed_monkey](https://i.imgur.com/iR8uqxm.png)

### Example 2: Adding to the `customRules` array of tables

If any of the existing tables are not fit for your report needs, you can add tables via your custom plugin.  Let's add a table by pushing a table object on the `customRules` array.

The table object structure is simple: `title` for the table title, and then a 2D array of rows.

```js
...
  report: async (rule, context, report) => {
    // add custom table
    report.customRules.push({
      title: 'Menu',
      table: [
        ['Food', 'Price', 'Value'],
        ['Taco', '1.09', 'Yummy!'],
        ['Burrito', '1.89', 'Oh yeahhh'],
      ]
    })
  }
...
```

The result when running `solidarity report` will be a whole new table printed in the results!

![custom_menu](https://i.imgur.com/MWUiWXI.png)

#### 🎉 TADAAAA!  You're able to add to reports in any way you'd like!

### [More About Plugins](/docs/plugins.md)


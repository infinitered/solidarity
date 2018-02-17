import { GluegunCommand } from 'gluegun'

const createables = ['plugin']

module.exports = {
  alias: 'c',
  description: 'Displays this help',
  run: async context => {
    const { print, parameters, template, prompt } = context
    const { colors } = print

    const answerPluginName = await prompt.ask({
      type: 'input',
      name: 'plugin',
      message: 'What would you like to name your plugin?'
    })
    const pluginName = `solidarity-${answerPluginName.plugin.replace('solidarity-', '')}`

    const ruleChoices = [
      'I do not want a generated rule file',
      'Just a simple rule template',
      'Some optional rules'
    ]
    const answer = await prompt.ask({
      type: 'list',
      name: 'ruleChoice',
      message: 'What kind of rule file will you generate from your plugin?',
      choices: ruleChoices
    })

    const customRules = await prompt.confirm('Will you need custom rules? (e.g. Rules other than provided types)')

    switch (parameters.first && parameters.first.toLowerCase()) {
      case 'plugin':
        print.info(`Creating a plugin ${pluginName}`)
        const files = [
          '.gitignore',
          'README.md',
          'package.json'
        ]
        files.map((file) => {
          template.generate({
            template: `${file}.ejs`,
            target: `${pluginName}/${file}`,
            props: {},
          })
        })
        break
      default:
        print.error('Missing what to create')
        print.error('solidarity create <wut?>')
        print.info(`Things you can create: ${createables}`)
    }
  },
} as GluegunCommand

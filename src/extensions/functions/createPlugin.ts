module.exports = async (context) => {
  const { print, parameters, template, prompt } = context

  const answerPluginName = await prompt.ask({
    type: 'input',
    name: 'plugin',
    message: 'Plugin name? (we will add the namespacing for you)'
  })
  const pluginName = `solidarity-${answerPluginName.plugin.replace('solidarity-', '')}`

  const ruleChoices = [
    'I do not want a generated rule file',
    'Just a simple rule template',
    'Template + optional rules'
  ]
  const answer = await prompt.ask({
    type: 'list',
    name: 'ruleChoice',
    message: 'Your initial rule file template?',
    choices: ruleChoices
  })

  const customRules = await prompt.confirm('Custom rules? (e.g. Rules other than basic types)')

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
}

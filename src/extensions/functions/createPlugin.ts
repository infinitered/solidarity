module.exports = async context => {
  let files = [['.gitignore.ejs', '.gitignore'], ['README.md.ejs', 'README.md'], ['package.json.ejs', 'package.json']]
  const { print, template, prompt } = context

  const answerPluginName = await prompt.ask({
    type: 'input',
    name: 'plugin',
    message: 'Plugin name? (we will add the namespacing for you)',
  })
  const pluginName = `solidarity-${answerPluginName.plugin.replace('solidarity-', '')}`

  const ruleChoices = [
    'I do not want a generated rule file',
    'Just a simple rule template',
    'Template + optional rules',
  ]
  const answer = await prompt.ask({
    type: 'list',
    name: 'ruleChoice',
    message: 'Your initial rule file template?',
    choices: ruleChoices,
  })

  if (answer.ruleChoice === ruleChoices[1]) {
    files.push(['rules-template.json.ejs', `templates/${pluginName}-template.json`])
    files.push(['simple-plugin.js.ejs', `extensions/${pluginName}.js`])
  } else if (answer.ruleChoice === ruleChoices[2]) {
    files.push(['rules-template.json.ejs', `templates/${pluginName}-template.json`])
    files.push(['helpful-plugin.js.ejs', `extensions/${pluginName}.js`])
    files.push(['addOptionalRules.js.ejs', `extensions/helpers/addOptionalRules.js`])
  }

  const customRules = await prompt.confirm('Custom rules? (e.g. Rules other than basic types)')

  print.info(`Creating plugin ${pluginName}`)
  // copy files over
  files.map(fileSet => {
    template.generate({
      template: fileSet[0],
      target: `${pluginName}/${fileSet[1]}`,
      props: { pluginName, customRules },
    })
  })
}

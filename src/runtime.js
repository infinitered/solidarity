const { build } = require('gluegun')

const BRAND = 'solidarity'

/**
 * Sets up the solidarity runtime by configuring gluegun to use
 * the right plugin structure for us.
 */
function configureRuntime () {
  return (
    build()
      // Brand is used for default config files (if any).
      .brand(BRAND)
      // The default plugin is the directory we're in right now, so
      // the commands sub-directory will contain the first right of
      // refusal to handle user's requests.
      .loadDefault(__dirname)
      // TODO: maybe there's other places you'd like to load plugins from?
      // .load(`~/.${BRAND}`)

      // These are the magic tokens found inside command js sources
      // which plugin authors use to specify the command users can type
      // as well as the help they see.
      .token('commandName', `${BRAND}Command`)
      .token('commandDescription', `${BRAND}Description`)
      // let's build it
      .createRuntime()
  )
}

module.exports = { BRAND, configureRuntime }

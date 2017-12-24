const buildCliRequirement = async (context, requirementName) => {
  const { parameters, solidarity, prompt, print } = context
  const { getVersion } = solidarity

  const rule = parameters.first
  const binary = parameters.second
  const requirement = {
    [requirementName]: [
      {
        rule,
        binary,
      },
    ],
  }

  const userAnswer = await prompt.ask({
    name: 'enforceVersion',
    type: 'confirm',
    message: 'Would you like to enforce a version requirement?',
  })

  if (userAnswer.enforceVersion) {
    return getVersion(requirement[requirementName][0], context)
      .then(sysVersion => {
        print.info(`Your system currently has version ${sysVersion}`)
        print.info(`Semver requirement for '${binary}' binary : ^${sysVersion}`)
        requirement[requirementName][0]['semver'] = sysVersion

        return requirement
      })
      .catch(() => {
        print.error(
          'Seems as though you do not have this binary installed. Please install this binary first'
        )
      })
  }

  return requirement
}

const buildEnvRequirement = (context, requirementName) => {
  const { parameters } = context

  const rule = parameters.first
  const variable = parameters.second

  return {
    [requirementName]: [
      {
        rule,
        variable,
      },
    ],
  }
}

const buildFileRequirement = (context, requirementName) => {
  const { parameters } = context

  const rule = parameters.first
  const location = parameters.second

  return {
    [requirementName]: [
      {
        rule,
        location,
      },
    ],
  }
}

const buildShellRequirement = async (context, requirementName) => {
  const { parameters, prompt } = context

  const rule = parameters.first
  const shellCommand = parameters.second

  if (rule && shellCommand) {
    const response = await prompt.ask({
      name: 'shellMatch',
      type: 'input',
      message: 'What would you like the shell command to match on?',
    })

    return {
      [requirementName]: [
        {
          rule,
          command: shellCommand,
          match: response.shellMatch,
        },
      ],
    }
  }
}

module.exports = {
  cli: {
    callback: buildCliRequirement,
    key: 'binary',
  },
  env: {
    callback: buildEnvRequirement,
    key: 'variable',
  },
  file: {
    callback: buildFileRequirement,
    key: 'location',
  },
  dir: {
    callback: buildFileRequirement,
    key: 'location',
  },
  shell: {
    callback: buildShellRequirement,
    key: 'command',
  },
}

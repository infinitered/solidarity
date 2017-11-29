module.exports = (solidaritySettings, newRequirement) => {
  return {
    ...solidaritySettings,
    requirements: {
      ...solidaritySettings.requirements,
      ...newRequirement
    }
  }
}

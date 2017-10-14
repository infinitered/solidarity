module.exports = (rule, context) => {
  const {filesystem} = context
  return filesystem.exists(rule.location) === 'file'
}

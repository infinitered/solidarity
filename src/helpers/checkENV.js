module.exports = async (rule, context) => {
  return process.env[rule.variable]
}

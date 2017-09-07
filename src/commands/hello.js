// @solidarityDescription Say hello and be nice.

module.exports = async function (context) {
  const { print } = context

  print.info(`👊 I got your back.`)
}

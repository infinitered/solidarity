const { head, tail, pipe, flatten } = require('ramda')
module.exports = async (requirement, context) => {
  const requirementName = head(requirement)
  const rules = pipe(tail, flatten)(requirement)
  return ['FAILLLLSAUCE']
  // return []
}

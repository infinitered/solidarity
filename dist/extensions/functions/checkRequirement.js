var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const checkCLI = require('./checkCLI');
const checkENV = require('./checkENV');
const skipRule = require('./skipRule');
module.exports = (requirement, context) => __awaiter(this, void 0, void 0, function* () {
    const { head, tail, pipe, flatten, map } = require('ramda');
    const { print } = context;
    const requirementName = head(requirement);
    const rules = pipe(tail, flatten)(requirement);
    let ruleString = '';
    const spinner = print.spin(`Verifying ${requirementName}`);
    const addFailure = (commonMessage, customMessage, ruleString) => {
        spinner.fail(ruleString);
        return customMessage || commonMessage;
    };
    // check each rule for requirement
    const ruleChecks = yield map((rule) => __awaiter(this, void 0, void 0, function* () {
        // Make sure this rule is active
        if (skipRule(rule.platform))
            return [];
        switch (rule.rule) {
            // Handle CLI rule check
            case 'cli':
                const cliResult = yield checkCLI(rule, context);
                ruleString = `${requirementName} - ${rule.binary} binary`;
                if (cliResult) {
                    return addFailure(cliResult, rule.error, ruleString);
                }
                else {
                    spinner.succeed(ruleString);
                    return [];
                }
            // Handle ENV rule check
            case 'env':
                const envResult = yield checkENV(rule, context);
                ruleString = `${requirementName} - ${rule.variable} env`;
                if (envResult) {
                    spinner.succeed(ruleString);
                    return [];
                }
                else {
                    return addFailure(`'$${rule.variable}' environment variable not found`, rule.error, ruleString);
                }
            default:
                return addFailure(`Encountered unknown rule '${rule.rule}'`, rule.error, `${requirementName} - ${rule.rule}`);
        }
    }), rules);
    // Run all the rule checks for a requirement
    return Promise.all(ruleChecks)
        .then(results => {
        spinner.stop();
        return results;
    })
        .catch(err => print.error(err));
});

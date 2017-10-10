var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
module.exports = (requirement, settings, context) => __awaiter(this, void 0, void 0, function* () {
    const { head, tail, pipe, flatten, map } = require('ramda');
    const checkCLIForUpdates = require('./checkCLIForUpdates');
    const skipRule = require('./skipRule');
    const { print } = context;
    const requirementName = head(requirement);
    const rules = pipe(tail, flatten)(requirement);
    let ruleString = '';
    const spinner = print.spin(`Updating ${requirementName}`);
    // check each rule for requirement
    const ruleChecks = yield map((rule) => __awaiter(this, void 0, void 0, function* () {
        // skip if we can't update
        if (skipRule(rule.platform) || !rule.semver)
            return [];
        switch (rule.rule) {
            // Handle CLI rule update
            case 'cli':
                const updateResult = yield checkCLIForUpdates(rule, context);
                ruleString = `Keep ${rule.binary} ${rule.semver}`;
                if (updateResult) {
                    spinner.succeed(updateResult);
                    return updateResult;
                }
                else {
                    spinner.succeed(ruleString);
                    return [];
                }
            default:
                return [];
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

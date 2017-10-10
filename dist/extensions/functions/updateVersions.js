var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
module.exports = (context) => __awaiter(this, void 0, void 0, function* () {
    const { map, toPairs, isEmpty, flatten } = require('ramda');
    const { solidarity, print } = context;
    const { getSolidaritySettings, setSolidaritySettings, updateRequirement } = solidarity;
    // load current solidarity file
    const solidaritySettings = getSolidaritySettings(context);
    // Map over requirements with option to mutate settings
    const checks = yield map((requirement) => __awaiter(this, void 0, void 0, function* () { return updateRequirement(requirement, solidaritySettings, context); }), toPairs(solidaritySettings));
    // run the array of promises you just created
    yield Promise.all(checks)
        .then(results => {
        const updates = flatten(results);
        if (isEmpty(updates)) {
            print.success('\n No Changes');
        }
        else {
            setSolidaritySettings(solidaritySettings, context);
            print.success(`\n ${updates.length} Rule(s) updated`);
        }
    })
        .catch(err => {
        print.error(err);
        process.exit(2);
    });
});

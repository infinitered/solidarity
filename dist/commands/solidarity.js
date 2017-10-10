var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var Solidarity;
(function (Solidarity) {
    const { map, toPairs, isEmpty, flatten } = require('ramda');
    const checkForEscapeHatchFlags = (context) => __awaiter(this, void 0, void 0, function* () {
        const { print, parameters } = context;
        const { options } = parameters;
        if (options.help || options.h) {
            // Just looking for help
            print.printCommands(context);
            process.exit(0);
        }
        else if (options.version || options.v) {
            // Just looking for version
            print.info(require('../../package.json').version);
            process.exit(0);
        }
    });
    Solidarity.run = (context) => __awaiter(this, void 0, void 0, function* () {
        // drop out fast in these situations
        checkForEscapeHatchFlags(context);
        const { print, solidarity } = context;
        const { checkRequirement, getSolidaritySettings } = solidarity;
        // get settings
        const solidaritySettings = getSolidaritySettings(context);
        // build map of checks to perform
        const checks = yield map((requirement) => __awaiter(this, void 0, void 0, function* () { return checkRequirement(requirement, context); }), toPairs(solidaritySettings));
        // run the array of promises you just created
        yield Promise.all(checks)
            .then(results => {
            const errors = flatten(results);
            if (isEmpty(errors)) {
                print.success('\n Environment Checks Valid');
            }
            else {
                print.error('\n Solidarity Check Failed:');
                print.error(errors);
                process.exit(1);
            }
        })
            .catch(err => {
            print.error(err);
            process.exit(2);
        });
    });
})(Solidarity || (Solidarity = {}));
// Export command
module.exports = {
    description: 'Check environment rules',
    run: Solidarity.run
};

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Get the version of a specific CLI
module.exports = (rule, context) => __awaiter(this, void 0, void 0, function* () {
    const { system, solidarity } = context;
    let versionOutput;
    // They specified how to check version
    if (rule.version) {
        versionOutput = yield system.run(`${rule.binary} ${rule.version}`);
    }
    else {
        // We try the following in this order
        // -v, --version, -version
        try {
            versionOutput = yield system.run(`${rule.binary} -v`);
        }
        catch (_e) {
            try {
                versionOutput = yield system.run(`${rule.binary} --version`);
            }
            catch (_e) {
                try {
                    versionOutput = yield system.run(`${rule.binary} -version`);
                }
                catch (_e) {
                    throw 'No version identifier flag for this binary was found';
                }
            }
        }
    }
    // Now parse
    const correctLine = solidarity.getLineWithVersion(rule, versionOutput);
    const version = solidarity.removeNonVersionCharacters(rule, correctLine);
    return version;
});

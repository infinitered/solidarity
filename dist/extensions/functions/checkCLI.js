var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
module.exports = (rule, context) => __awaiter(this, void 0, void 0, function* () {
    const { system, semver, solidarity } = context;
    // First check for binary
    try {
        system.which(rule.binary);
    }
    catch (_e) {
        return `Binary '${rule.binary}' not found`;
    }
    // Is there a semver rule?
    if (rule.semver) {
        // ensure we have valid rule input
        if (!semver.validRange(rule.semver))
            return `Invalid semver rule ${rule.semver}`;
        const binaryVersion = yield solidarity.getVersion(rule, context);
        // pad zeros for any non-semver version systems (rules still work)
        let binarySemantic = binaryVersion;
        while (binarySemantic.split('.').length < 3) {
            binarySemantic += '.0';
        }
        // I can't get no satisfaction
        if (!semver.satisfies(binarySemantic, rule.semver)) {
            return `This system has an improper version for ${rule.binary}:
        Rule='${rule.semver}'
        Actual='${binaryVersion}'`;
        }
    }
});

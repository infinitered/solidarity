var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
module.exports = (rule, context) => __awaiter(this, void 0, void 0, function* () {
    const { system, semver, solidarity, print } = context;
    const { color } = print;
    // First check for binary
    try {
        system.which(rule.binary);
    }
    catch (_e) {
        return `Binary '${rule.binary}' not found`;
    }
    const binaryVersion = yield solidarity.getVersion(rule, context);
    // pad zeros for any non-semver version systems (rules still work)
    let binarySemantic = binaryVersion;
    while (binarySemantic.split('.').length < 3) {
        binarySemantic += '.0';
    }
    // If it doesn't satisfy, upgrade
    if (!semver.satisfies(binarySemantic, rule.semver)) {
        rule.semver = binaryVersion;
        return color.green(`Setting ${rule.binary} to '${binaryVersion}'`);
    }
});

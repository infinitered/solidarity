var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// @solidarityDescription Check location of known apps.
const run = (context) => __awaiter(this, void 0, void 0, function* () {
    const { print, system } = context;
    const rn = yield system.which(`react-native`);
    const xcrun = yield system.which('xcrun');
    const androidHome = process.env['ANDROID_HOME'];
    // generic printing
    print.table([
        ['react native', rn],
        ['xcrun', xcrun],
        ['android home', androidHome]
    ]);
});
// Export command
module.exports = {
    description: '',
    alias: 'd',
    run
};

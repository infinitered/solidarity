var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// @solidarityDescription Checks various programs.
const { head, last, trim, pipe, split, replace } = require('ramda');
var Report;
(function (Report) {
    Report.run = (context) => __awaiter(this, void 0, void 0, function* () {
        const { print, system } = context;
        const { colors } = print;
        const spinner = context.print.spin('Verifying Versions');
        // chomp result and kill `v` from versions (yeah node... we're talking about you!)
        // if nothing is returned, swap out for `None`
        const runTrim = (command) => __awaiter(this, void 0, void 0, function* () { return pipe(trim, replace('v', ''))(yield system.run(command)); });
        const printSeparator = () => print.info(colors.america('---------------------------------------'));
        const rnVersionRaw = yield runTrim(`react-native --version`);
        const rnVersion = pipe(split('\n'), head, trim, split(' '), last)(rnVersionRaw);
        const nodeVersion = yield runTrim('node --version');
        const npmVersion = yield runTrim('npm --version');
        const yarnVersion = yield runTrim('yarn --version');
        const xcodeBuild = yield runTrim('xcodebuild -version | head -1 | sed "s/Xcode //"');
        const cocoapods = yield runTrim('pod --version');
        const codePush = yield runTrim('code-push --version');
        const mobileCenter = yield runTrim('mobile-center -v | awk "{print $3}"');
        // android?
        // if > 25? cat $ANDROID_HOME/platform-tools/source.properties | grep Pkg.Revision
        //   const androidVersion = await system.run(`$ANDROID_HOME/tools/bin/sdkmanager --list | grep 'build-tools;#{ANDROID_SDK}' | tail -1 | awk '{print $3}'`)
        // else?
        //   cat $ANDROID_HOME/tools/source.properties | grep Pkg.Revision
        const androidSDKVersion = yield runTrim(`$ANDROID_HOME/tools/android list sdk | grep 'SDK Tools' | tail -1 | awk '{print $6}'`);
        spinner.succeed('Check Success');
        printSeparator();
        // generic printing
        print.table([
            ['Tool', 'Version'],
            ['---', '---'],
            ['react-native', rnVersion],
            ['node', nodeVersion],
            ['NPM', npmVersion],
            ['yarn ', yarnVersion],
            ['Android SDK', androidSDKVersion],
            ['Xcode', xcodeBuild],
            ['Cocoapods', cocoapods],
            ['Code Push', codePush],
            ['Mobile Center', mobileCenter]
        ]);
        printSeparator();
    });
})(Report || (Report = {}));
module.exports = {
    run: Report.run,
};

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const { build } = require('gluegun');
module.exports = () => __awaiter(this, void 0, void 0, function* () {
    // setup the runtime
    build()
        .brand('solidarity')
        .src(__dirname)
        .plugins('./node_modules', { matching: 'solidarity-*', hidden: true })
        .create()
        .run();
});

module.exports = (settings, context) => {
    const { print, filesystem } = context;
    try {
        // Write file
        filesystem.write('.solidarity', JSON.stringify(settings, null, 2), { atomic: true });
    }
    catch (e) {
        print.error(e);
        process.exit(1);
    }
};

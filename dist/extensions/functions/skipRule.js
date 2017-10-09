// Return true if we should skip
module.exports = (platform) => {
    if (typeof platform === 'string') {
        // it's a string
        return platform !== process.platform;
    }
    else if (typeof platform === 'object' && platform.length > 0) {
        // it's an array
        return !platform.includes(process.platform);
    }
    else {
        return false;
    }
};

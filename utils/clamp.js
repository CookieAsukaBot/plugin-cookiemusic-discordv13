function clamp (val, min, max) {
    return val > max ? max : val < min ? min : val;
};

module.exports = clamp;

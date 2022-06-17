const Song = require('../models/song');

// findOne
const findOne = async (model) => {
    let {guild, userID, metadata} = model;
    let song = await Song.findOne({ "metadata.url": metadata.url });

    if (song) {
        await Song.updateOne({ "metadata.url": metadata.url }, {
            $inc: {played: 1 }
        });
        return song;
    } else {
        let newSong = new Song({
            guild,
            userID,
            metadata
        });
        await newSong.save();
        return newSong;
    }
}

/**
 * @param {String} guild id del servidor
 * @returns devuelve una canción aleatoria
 */
const getRandomSong = async (guild) => {
    return random = await Song.aggregate([{ $sample: { size: 1 } }]);
}

module.exports = {
    findOne,
    getRandomSong,
}

/**
 * Parte un texto grande en fragmentos.
 * 
 * @returns retorna un array
 */
const splitLyrics = (lyrics) => {
    // Partir en objeto por cada X caracteres
    let i = 0;
    let output = [];
    let letters = 1500;

    while (i < lyrics.length){
        let initIndex = i;
        let endIndex = i + letters;

        output.push(lyrics.substring(initIndex, endIndex));
        i = endIndex;
    };

    return output;
}

module.exports = {
    splitLyrics
};

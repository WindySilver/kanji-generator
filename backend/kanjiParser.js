//Used to parse the data from kanji.json to SQL INSERT commands
import jsonData from './kanji.json' with { type: 'json' };

Object.keys(jsonData).forEach(key => {
    if(jsonData[key]["jlpt_new"] !== null) console.log(`('${key}', '${jsonData[key]["meanings"]}', '${jsonData[key]["readings_kun"]}', '${jsonData[key]["readings_on"]}', '${jsonData[key]["jlpt_new"]}'),`); //JLPT_new sisältää levelin 5 näemmä, paljo nullia kyl
});
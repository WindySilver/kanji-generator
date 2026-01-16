import axios from "axios";
import { useEffect, useState } from "react";

function App() {
  const [kanjiList, setkanjis] = useState<Kanji[]>([]);

  interface Kanji {
        kanji: string,
        translation: string,
        pronunciation_kun_yomi: string,
        pronunciation_on_yomi: string,
        JLPT: number
};

  const fetchkanjis = async () => {
    const response = await axios.get("http://localhost:8080");
    setkanjis(response.data.kanjiList);
  };

  useEffect(() => {
    fetchkanjis();
  }, []);

  return (
    <div >
      <h1>
        Kanji Generator
      </h1>
        {kanjiList.map((kanji) => (
          <div>
            <h1>{kanji.kanji}</h1>
            <p>Translation(s): {kanji.translation}</p>
            <p>kun-yomi: {kanji.pronunciation_kun_yomi}</p>
            <p>on-yomi: {kanji.pronunciation_on_yomi}</p>
            <p>JLPT level: {kanji.JLPT}</p>
          </div>
        ))}
    </div>
  );
}

export default App;

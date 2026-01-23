import axios from "axios";
import { useEffect, useState } from "react";

function App() {
  const [kanjiList, setkanjis] = useState<Kanji[]>([]);
  const [jlptSelection, setJLPT] = useState<{ [key: string]: boolean }>({
        one: false,
        two: false,
        three: false,
        four: false,
        five: false
    });
  const [showSelection, setShow] = useState<{ [key: string]: boolean }>({
        kanji: false,
        translation: false,
        pronunciation_kun_yomi: false,
        pronunciation_on_yomi: false,
        jlpt: false
    });

  interface Kanji {
        kanji: string,
        translation: string,
        pronunciation_kun_yomi: string,
        pronunciation_on_yomi: string,
        jlpt: number
};

type showRenderProps = {
  type: string,
  show: boolean,
  data: string | number
}

  const handleJLPTSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
        setJLPT((prevState) => ({
            ...prevState,
            [name]: checked
        }));
  }

  const handleShowSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
        setShow((prevState) => ({
            ...prevState,
            [name]: checked
        }));
  }

  const fetchkanjis = async () => {
    const response = await axios.get("http://localhost:8080");
    setkanjis(response.data);
  };


  function RenderKanjiData({type, show, data}: showRenderProps){
    if(show){
      if (type == 'kanji'){
        return <h1>{data}</h1>
      }
      else{
        let text = '';
        switch(type){
          case 'translation':
            text='Translation(s)';
            break;
          case  'pronunciation_kun_yomi':
            text='kun-yomi';
            break;
          case 'pronunciation_on_yomi':
            text='on-yomi';
            break;
          case 'jlpt':
            text='JLPT level';
            break;
          default:
            break;
        }
        return <p>{text}: {data}</p>
      }
    }
    return null;
  }


  useEffect(() => {
    fetchkanjis();
  }, []);

  return (
    <div>
      <h1>
        Kanji Generator
      </h1>

      <div>
        <p>Selected JLPT levels: </p>
        <input
                type="checkbox"
                name="five"
                checked={jlptSelection.five}
                onChange={handleJLPTSelection}
            />
          <label>5</label>
        <input
                type="checkbox"
                name="four"
                checked={jlptSelection.four}
                onChange={handleJLPTSelection}
            />
          <label>4</label>
        <input
                type="checkbox"
                name="three"
                checked={jlptSelection.three}
                onChange={handleJLPTSelection}
            />
          <label>3</label>
        <input
                type="checkbox"
                name="two"
                checked={jlptSelection.two}
                onChange={handleJLPTSelection}
            />
          <label>2</label>
        <input
                type="checkbox"
                name="one"
                checked={jlptSelection.one}
                onChange={handleJLPTSelection}
            />
          <label>1</label>
      </div>

      <div>
        <p>Select kanji information to show: </p>
        <input
                type="checkbox"
                name="kanji"
                checked={showSelection.kanji}
                onChange={handleShowSelection}
            />
          <label>kanji</label>
        <input
                type="checkbox"
                name="translation"
                checked={showSelection.translation}
                onChange={handleShowSelection}
            />
          <label>translation</label>
        <input
                type="checkbox"
                name="pronunciation_kun_yomi"
                checked={showSelection.pronunciation_kun_yomi}
                onChange={handleShowSelection}
            />
          <label>pronunciation (kun-yomi)</label>
        <input
                type="checkbox"
                name="pronunciation_on_yomi"
                checked={showSelection.pronunciation_on_yomi}
                onChange={handleShowSelection}
            />
          <label>pronunciation (on-yomi)</label>
        <input
                type="checkbox"
                name="jlpt"
                checked={showSelection.jlpt}
                onChange={handleShowSelection}
            />
          <label>JLPT level</label>

      </div>

        {kanjiList.map((kanji) => (
          <div key={kanji.kanji}>
            <RenderKanjiData type='kanji' show={showSelection.kanji} data={kanji.kanji} />
            <RenderKanjiData type='translation' show={showSelection.translation} data={kanji.translation} />
            <RenderKanjiData type='pronunciation_kun_yomi' show={showSelection.pronunciation_kun_yomi} data={kanji.pronunciation_kun_yomi} />
            <RenderKanjiData type='pronunciation_on_yomi' show={showSelection.pronunciation_on_yomi} data={kanji.pronunciation_on_yomi} />
            <RenderKanjiData type='jlpt' show={showSelection.jlpt} data={kanji.jlpt} />

          </div>
        ))}
    </div>
  );
}

export default App;

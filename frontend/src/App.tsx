import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import './App.css';

function App() {
  const [howmany, setHowMany] = useState<number>(1);
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

  const [errorMess, setErrorMess] = useState<string>( '');
  const [showRequestError, setReqError] = useState<boolean> (false);
  const [isDarkMode, setDarkMode] = useState(true);

type showRenderProps = {
  type: string,
  show: boolean,
  data: string | number
}

type errorMessageProps = {
  message: string,
  show: boolean
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

  function removeKanji (kanji: string) {
    setkanjis(kanjiList.filter(kanjiL => kanjiL.kanji !== kanji));
  }

  function KanjiGeneration(){
  async function fetchkanjis  () {
    try{
    const response = await axios.get("http://localhost:8080", {
          params: {
                   one: jlptSelection.one,
        two: jlptSelection.two,
        three: jlptSelection.three,
        four: jlptSelection.four,
        five: jlptSelection.five,
        howmany: howmany
          }
        });
    setReqError(false);
    setErrorMess('')
    setkanjis(response.data);}
    catch (e){
      const error = e as AxiosError;
      setReqError(true)
      if (error.response?.data) setErrorMess( error.response?.data.toString()); 
      console.error(error.response?.data)
      console.log(errorMess);
    }
  }

  function KanjiList() {
    if(kanjiList.length > 0){
        return(
        <div className="list">
          <h2>Generated {kanjiList.length} kanji</h2>
          {kanjiList.map((kanji) => (
          <div key={kanji.kanji}>
            <RenderKanjiData type='kanji' show={showSelection.kanji} data={kanji.kanji} />
            <RenderKanjiData type='translation' show={showSelection.translation} data={kanji.translation} />
            <RenderKanjiData type='pronunciation_kun_yomi' show={showSelection.pronunciation_kun_yomi} data={kanji.pronunciation_kun_yomi} />
            <RenderKanjiData type='pronunciation_on_yomi' show={showSelection.pronunciation_on_yomi} data={kanji.pronunciation_on_yomi} />
            <RenderKanjiData type='jlpt' show={showSelection.jlpt} data={kanji.jlpt} />
            <button onClick={() => removeKanji(kanji.kanji)}>
              Remove this one from the list
            </button>
            <hr />
          </div>
        ))}
        </div>)
        }
    return null;
}

    return (
      <div>
      <div>
        <button
        disabled={!jlptSelection.five&&!jlptSelection.four&&!jlptSelection.three&&!jlptSelection.two&&!jlptSelection.one||howmany<1}
        onClick={fetchkanjis}
        >Generate kanji</button>
        <ErrorMessage message={errorMess} show={showRequestError} />
      </div>
      <KanjiList />
        </div>

    );
  }

  function setMode(){
    const root = document.body;
    root!.classList.remove(isDarkMode ? "light" : "dark");
    root!.classList.add(isDarkMode ? "dark" : "light");
  }

  useEffect (() => {
    setMode();
  })

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
        return <p><span className="emphasis">{text}:</span> {data}</p>
      }
    }
    return null;
  }

  function ErrorMessage({message, show}: errorMessageProps){
    if (show){
      return (
            <div>
            <br />
            <b className="error">{message}</b>
          </div>
      )
    }
    
    return null;
  }



  return (
    <div className="mainBody">
      <h1>
        Kanji Generator
      </h1>
      <button onClick={() => setDarkMode(!isDarkMode)}>
      {isDarkMode ? '日' : '月'}
      </button>
      <div>
        <p className="emphasis">Selected JLPT levels: </p>
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
        <p className="emphasis">Select kanji information to show: </p>
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
          <ErrorMessage message="You have not selected any data to show!"
          show={!showSelection.kanji && !showSelection.translation && !showSelection.pronunciation_kun_yomi && !showSelection.pronunciation_on_yomi && !showSelection.jlpt}
          />
      </div>
      <div>
        <p className="emphasis">How many kanji should be generated: </p>
        <input
          type="number"
          name="howmany"
          onChange={e => setHowMany(Number(e.target.value))}
          defaultValue={1}
          min={1}
          />
          <ErrorMessage message="Improper value" show={howmany<=0} />
        </div>
      <KanjiGeneration />
    </div>
  );
}

export default App;

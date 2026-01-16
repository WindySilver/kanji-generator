import express from "express";
import cors from "cors";

const app = express();

const CORS_OPTIONS = {
  origin: ["http://localhost:5173"]
};

app.use(cors(CORS_OPTIONS));


// Example data, will later be fetched from a database because this tech stack is so overtly complicated
app.get("/", (req, res) => {
  res.json({
    kanjiList: [
      {
        kanji: "乙",
        translation: "the latter, duplicate, strange, witty, fishhook radical (no. 5)",
        pronunciation_kun_yomi: "きのと, おと, おと-",
        pronunciation_on_yomi: "オツ, オチ, イツ",
        JLPT: 1
      },
      {
        kanji: "大",
        translation: "large, big",
        pronunciation_kun_yomi: "おお, おお.きい, おお.いに, もと, まさる, ひろし, はじめ, とも, たかし, おう, わ, うふ, -おお.いに, おお-",
        pronunciation_on_yomi: "ダイ, ダ, タイ, タ",
        JLPT: 5
      }
    ]
  });
});

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});

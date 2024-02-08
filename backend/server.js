const express = require("express");
const multer = require("multer");
const mongoose = require("mongoose");
const cors = require("cors");
const fs = require("fs");
const speech2text = require("./speech2text");
const keywords = require("./keywords");
const summary = require("./summary");
const synonyms = require("./synonyms");
const targetTimestamp = require("./targetTimestamp");

const app = express();

// CORS 미들웨어 추가
app.use(cors());

// MongoDB 연결
mongoose.connect("mongodb://localhost:27017/keyloud");
const conn = mongoose.connection;

// 파일 업로드 라우트
// 파일 업로드 라우트
app.post("/upload_files", multer().single("files"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const copy_path = "./uploads/" + req.file.originalname;
    fs.writeFileSync(copy_path, req.file.buffer);

    const s2t_result = await speech2text(copy_path);

    const text_result = s2t_result[0];
    const summary_result = await summary(text_result);
    const keywords_result = await keywords(text_result);
    const synonyms_result = await synonyms(keywords_result);

    const timestamp_result = s2t_result[1];

    // 여기에서 새 파일 이름으로 업데이트
    const newFileName = req.body.customFileName || req.file.originalname;

    // 파일이 업로드된 후의 처리
    const fileDetails = {
      filename: newFileName,
      content: req.file.buffer, // 바이너리 데이터로 저장
      scripts: text_result,
      summary: summary_result,
      keywords: keywords_result,
      synonyms: synonyms_result,
      timestamp: timestamp_result,
      // 기타 필요한 파일 정보들 ..추가 -> erd보고 추가
    };

    // MongoDB에 파일 정보 저장
    await conn.db.collection("test").insertOne(fileDetails);

    // MongoDB에 파일을 저장한 후에 파일 삭제
    fs.unlinkSync(copy_path);

    console.log("File uploaded successfully");
    res.json({ message: "File uploaded successfully" });
  } catch (error) {
    console.error("Error during file upload:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


// Update URL로 요청이 들어왔을 때의 처리
app.post("/update_scripts", async (req, res) => {
  try {
    const collection = conn.db.collection("test");

    // 프론트엔드에서 보낸 새로운 summary 값
    const newScripts = req.body.newScripts;

    // 특정 문서 조회 및 summary 필드 업데이트
    const result = await collection.updateOne({
      $set: { scripts: newScripts },
    });

    if (result.modifiedCount > 0) {
      console.log("Scripts updated successfully");
      res.json({ message: "Scripts updated successfully" });
    } else {
      console.log("No document found or no modification needed");
      res.json({ message: "No document found or no modification needed" });
    }
  } catch (error) {
    console.error("Error during update:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Update URL로 요청이 들어왔을 때의 처리
app.post("/update_summary", async (req, res) => {
  try {
    const collection = conn.db.collection("test");

    // 프론트엔드에서 보낸 새로운 summary 값
    const newSummary = req.body.newSummary;

    // 특정 문서 조회 및 summary 필드 업데이트
    const result = await collection.updateOne(
      {
        /* 여기에 원하는 조건을 추가하세요 */
      },
      { $set: { summary: newSummary } }
    );

    if (result.modifiedCount > 0) {
      console.log("Summary updated successfully");
      res.json({ message: "Summary updated successfully" });
    } else {
      console.log("No document found or no modification needed");
      res.json({ message: "No document found or no modification needed" });
    }
  } catch (error) {
    console.error("Error during update:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.delete("/delete_files", async (req, res) => {
  try {
    // 클라이언트에서 전송된 요청 본문에서 삭제할 문서의 _id 값 가져오기
    const documentId = req.body.documentId; // 클라이언트에서 요청 시 실제 _id 값이 담긴 필드명에 맞게 수정

    // id로 조회하여 문서 삭제
    const result = await db
      .collection("test")
      .deleteOne({ _id: new ObjectID(documentId) });

    if (result.deletedCount === 1) {
      res.status(200).json({ message: "문서가 성공적으로 삭제되었습니다." });
    } else {
      res.status(404).json({
        message: "삭제할 문서를 찾지 못했거나 삭제 중 오류가 발생했습니다.",
      });
    }

    client.close();
  } catch (error) {
    console.error("Error during document deletion:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/keyword_search", async (req, res) => {
  try {
    const collection = conn.db.collection("test");

    const keyword = req.query.keyword;
    const regex = new RegExp(keyword, "i"); // 대소문자 구분 없이 검색
    const resultDictionary = [];
    // MongoDB 쿼리를 통해 파일 검색
    const projection = {
      _id: 1,
      filename: 1,
      content: 0,
      scripts: 1,
      summary: 0,
      keywords: 1,
      synonyms: 0,
      timestamp: 1,
    };

    const searchResults = await collection.find({}, projection).toArray();

    console.log("here");
    for (const document of searchResults) {
      // 각 문서의 _id를 키로 사용하여 targetTimestamp 함수의 결과를 값으로 설정
      const timestamps = await targetTimestamp(document.scripts, keyword);
      if (timestamps["index"].length > 0) {
        timestamps["_id"] = document._id.toString();
        timestamps["filename"] = document.filename.toString();
        timestamps["keywords"] = document.keywords;
        timestamps["timestamp"] = document.timestamp;
        resultDictionary.push(timestamps);
      }
    }
    console.log(resultDictionary);
    res.send(resultDictionary);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(5000, () => {
  console.log("Server started...");
});
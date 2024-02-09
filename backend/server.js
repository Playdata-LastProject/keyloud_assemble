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
  app.use(cors({
    origin: 'http://localhost:3000', // React 서버의 주소
    credentials: true, // 필요에 따라 설정
  }));

// MongoDB 연결
mongoose.connect("mongodb://localhost:27017/keyloud");
const conn = mongoose.connection;
// 파일 업로드 라우트
app.post("/upload_files", multer().single("files"), async (req, res) => {
  const collection = conn.db.collection("test");
  const customName = req.body.customFileName;
  const sameName = await collection.find({ filename: customName }).toArray();
  if (sameName.length > 0) {
    return res.send(["이미 있는 이름입니다. 다른 이름을 지어주세요!"]);
  }
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    fs.writeFileSync(`./uploads/${req.file.originalname}`, req.file.buffer);

    const copy_path = "./uploads/" + req.file.originalname;

    const s2t_result = await speech2text(copy_path);

    const text_result = s2t_result[0];
    const summary_result = await summary(text_result);
    const keywords_result = await keywords(text_result);
    const synonyms_result = await synonyms(keywords_result);

    const timestamp_result = s2t_result[1];

    // 파일이 업로드된 후의 처리
    const fileDetails = {
      filename: customName,
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
    res.json({ message: "File uploaded successfully" });
    console.log("File uploaded successfully");

    fs.unlinkSync(`./uploads/${req.file.originalname}`);
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
    const documentName = req.body.documentName;

    // id로 조회하여 문서 삭제
    const result = await db
      .collection("test")
      .deleteOne({ filename: new ObjectID(documentName) });

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
    const resultList = [];
    // MongoDB 쿼리를 통해 파일 검색
    const projection = {
      filename: 1,
      content: 0,
      scripts: 1,
      summary: 0,
      keywords: 1,
      synonyms: 0,
      timestamp: 0,
    };

    const searchResults = await collection.find({}, projection).toArray();

    console.log("=============================");
    for (const document of searchResults) {
      const targetIndex = await targetTimestamp(document.scripts, keyword);
      if (targetIndex["index"].length > 0) {
        targetIndex["filename"] = document.filename.toString();
        targetIndex["keywords"] = document.keywords;
        resultList.push(targetIndex);
      }
    }
    console.log(resultList);
    res.send(resultList);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/contents", async (req, res) => {
  try {
    const collection = conn.db.collection("test");

    const targetName = req.query.fileName;
    // MongoDB 쿼리를 통해 파일 검색
    console.log(targetName);
    const projection = {
      filename: 0,
      content: 1,
      scripts: 1,
      summary: 1,
      keywords: 0,
      synonyms: 1,
      timestamp: 1,
    };

    const content = await collection.findOne(
      { filename: targetName },
      projection
    );

    console.log(content.targetName);
    res.json(content);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(5000, () => {
  console.log("Server started...");
});

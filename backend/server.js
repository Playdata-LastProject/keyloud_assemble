const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const mongoose = require("mongoose");
const cors = require("cors");
const fs = require("fs");
const speech2text = require("./speech2text");
const keywords = require("./keywords");
const summary = require("./summary");
const synonyms = require("./synonyms");
const { searchInScript, searchInKeywords } = require("./searching");
const mime = require("mime");
const path = require("path");

const app = express();
app.use(bodyParser.json());

// CORS 미들웨어 추가
app.use(cors());

// MongoDB 연결
mongoose.connect("mongodb://52.78.157.198:27017/keyloud");
const conn = mongoose.connection;

app.post("/create_folders", async (req, res) => {
  const collection = conn.db.collection("folders");
  const folderName = req.body.folderName;
  const sameName = await collection.findOne({ folderName: folderName });

  if (!sameName) {
    const folderDetails = {
      folderName: folderName,
    };
    console.log("Folder Creation");
    // MongoDB에 파일 정보 저장
    await collection.insertOne(folderDetails);
  } else {
    res.send("same name");
  }
});

app.post("/listUpFolders", async (req, res) => {
  const collection = conn.db.collection("folders");

  const projection = { folderName: 1 }; // folderName은 1로 설정하여 반환, _id는 0으로 설정하여 반환하지 않음

  const folderNames = await collection.find({}, projection);
  const folderNamesList = await folderNames.toArray();
  const result = folderNamesList.map((item) => item.folderName);
  //console.log(result);
  res.send(result);
});

app.get("/listUpFiles", async (req, res) => {
  const collection = conn.db.collection("files");
  const targetFolder = req.query.folderName;

  const fileResults = await collection.find({
    folderName: targetFolder,
    filename: { $exists: true },
  });
  const fileResultsList = await fileResults.toArray();
  const result = fileResultsList.map((item) => item.filename);

  console.log(result);
  res.send(result);
});

// 파일 업로드 라우트
app.post("/upload_files", multer().single("files"), async (req, res) => {
  const collection = conn.db.collection("files");
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

    const extension = path.extname(req.file.originalname);
    const mimeType = mime.getType(extension);

    // 파일이 업로드된 후의 처리
    const fileDetails = {
      folderName: req.body.selectedFolder,
      filename: customName,
      content: req.file.buffer, // 바이너리 데이터로 저장
      mimeType: mimeType,
      scripts: text_result,
      summary: summary_result,
      keywords: keywords_result,
      synonyms: synonyms_result,
      timestamp: timestamp_result,
      // 기타 필요한 파일 정보들 ..추가 -> erd보고 추가
    };

    // MongoDB에 파일 정보 저장
    await conn.db.collection("files").insertOne(fileDetails);
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
    const collection = conn.db.collection("files");

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
    const collection = conn.db.collection("files");

    // 프론트엔드에서 보낸 새로운 summary 값
    const newSummary = req.body.newSummary;

    // 특정 문서 조회 및 summary 필드 업데이트
    const result = await collection.updateOne({
      $set: { summary: newSummary },
    });

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

// trash URL로 요청이 들어왔을 때의 처리
app.get("/trash_files", async (req, res) => {
  try {
    const collection = conn.db.collection("trash");

    // trash collection의 모든 문서 가져오기
    const trashData = await collection.find({}).toArray();

    // 가져온 데이터에서 filename 필드의 값만 추출하여 배열로 만듦
    const filenames = trashData.map((item) => item.filename);

    // 가져온 데이터를 클라이언트에 응답
    res.json(filenames);
    console.log("응답한 이름:", filenames);

    console.log("Trash files retrieved successfully");
  } catch (error) {
    console.error("Error during retrieving trash files:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.delete("/delete_all_files", async (req, res) => {
  try {
    // trash collection의 모든 데이터 삭제
    const result = await conn.db.collection("trash").deleteMany({});

    if (result.deletedCount > 0) {
      console.log("All trash files deleted successfully");
      res.status(200).json({ message: "All trash files deleted successfully" });
    } else {
      console.log("No trash files found or no deletion needed");
      res
        .status(404)
        .json({ message: "No trash files found or no deletion needed" });
    }
  } catch (error) {
    console.error("Error during deleting all trash files:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.delete("/move_to_trash", async (req, res) => {
  try {
    const documentName = req.body.fileName;
    console.log("삭제할 파일:", documentName);

    // 파일을 'files' 컬렉션에서 조회하여 데이터를 얻어옴
    const fileData = await conn.db
      .collection("files")
      .findOne({ filename: documentName });

    if (fileData) {
      // 파일을 'trash' 컬렉션으로 이동
      const moveToTrashResult = await conn.db
        .collection("trash")
        .insertOne(fileData);

      if (moveToTrashResult.acknowledged) {
        // 파일을 'files' 컬렉션에서 삭제
        const deleteResult = await conn.db
          .collection("files")
          .deleteOne({ filename: documentName });

        if (deleteResult.acknowledged) {
          res.status(200).json({
            message: "문서가 성공적으로 삭제되고 휴지통으로 이동되었습니다.",
          });
        } else {
          res.status(500).json({
            message:
              "휴지통으로 이동한 문서를 'files' 컬렉션에서 삭제하는 중 오류가 발생했습니다.",
          });
        }
      } else {
        res
          .status(500)
          .json({ message: "휴지통으로 이동 중 오류가 발생했습니다." });
      }
    } else {
      res.status(404).json({
        message:
          "삭제할 문서를 찾지 못했거나 데이터를 가져오는 중 오류가 발생했습니다.",
      });
    }
  } catch (error) {
    console.error("Error during document deletion:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.delete("/delete_files", async (req, res) => {
  try {
    const documentName = req.body.documentName;

    // id로 조회하여 문서 삭제
    const result = await conn.db
      .collection("files")
      .deleteOne({ filename: new ObjectID(documentName) });

    if (result.deletedCount === 1) {
      res.status(200).json({ message: "문서가 성공적으로 삭제되었습니다." });
    } else {
      res.status(404).json({
        message: "삭제할 문서를 찾지 못했거나 삭제 중 오류가 발생했습니다.",
      });
    }
  } catch (error) {
    console.error("Error during document deletion:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/keyword_search", async (req, res) => {
  try {
    const collection = conn.db.collection("files");

    const targetWord = req.query.keyword;
    const regex = new RegExp(targetWord, "i"); // 대소문자 구분 없이 검색
    // MongoDB 쿼리를 통해 파일 검색
    const projection = {
      folderName: 0,
      filename: 1,
      content: 0,
      scripts: 1,
      summary: 0,
      keywords: 1,
      synonyms: 1,
    };

    const data = await collection.find({}, projection).toArray();

    console.log("=============================");
    const includeInScript = [];
    const includeInKeywords = [];
    const includeInSynonyms = [];

    for (const document of data) {
      const searching = await searchInScript(document.scripts, targetWord);
      if (searching["index"].length > 0) {
        searching["filename"] = document.filename.toString();
        searching["keywords"] = document.keywords;
        searching["synonyms"] = document.synonyms;
        includeInScript.push(searching);
      } else {
        const searching = await searchInKeywords(document.keywords, targetWord);
        if (searching["index"].length > 0) {
          searching["filename"] = document.filename.toString();
          searching["keywords"] = document.keywords;
          searching["synonyms"] = document.synonyms;
          includeInKeywords.push(searching);
        } else {
          const searching = await searchInKeywords(
            document.synonyms,
            targetWord
          );
          if (searching["index"].length > 0) {
            searching["filename"] = document.filename.toString();
            searching["keywords"] = document.keywords;
            searching["synonyms"] = document.synonyms;
            includeInSynonyms.push(searching);
          }
        }
      }
    }

    const targetSynonyms = await synonyms(targetWord);
    console.log([includeInScript, includeInKeywords, includeInSynonyms]);
    res.send([
      targetSynonyms[0],
      targetSynonyms[1],
      includeInScript,
      includeInKeywords,
      includeInSynonyms,
    ]);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/contents", async (req, res) => {
  try {
    const collection = conn.db.collection("files");

    const targetName = req.query.fileName;
    // MongoDB 쿼리를 통해 파일 검색
    console.log(targetName);
    const projection = {
      folderName: 0,
      filename: 0,
      content: 1,
      mimeType: 1,
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

    res.json(content);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/get_audio", async (req, res) => {
  const filename = req.query.filename;

  try {
    // 데이터베이스에서 해당 파일의 바이너리 데이터 가져오기
    const collection = conn.db.collection("files");

    const results = await collection.findOne({
      filename: filename,
      content: { $exists: true },
      mimeType: { $exists: true },
    });
    // 파일의 MIME 타입에 따라 Content-Type 설정
    const MIME = results.mimeType;
    res.setHeader("Content-Type", MIME); // 예시로 'audio/*/
    res.send(results.content);
  } catch (error) {
    console.error("Error retrieving file:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.listen(5000, "0.0.0.0", () => {
  console.log("Server started...");
});

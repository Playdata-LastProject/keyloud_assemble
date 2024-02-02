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

// CORS middleware
app.use(cors());

async function test(conn) {
    try {
      const keyword = "컴퓨터인터페이스";
      const resultDictionary = {};
  
      // MongoDB query to search for files
      const projection = { _id: 1, filename: 1, content: 0, scripts: 1, summary: 0, keywords: 1, synonyms: 0, timestamp: 1 };
  
      // MongoDB collection
      const collection = conn.db.collection("test");
  
      // MongoDB query to find files
      const searchResults = await collection.find({}, projection).toArray();
      
      // Process each document
      for (const document of searchResults) {
        // Use _id as the key for the resultDictionary
        const timestamps = await targetTimestamp(document.scripts, keyword);
        
        // Check if timestamps exist and add to the resultDictionary
        if (timestamps.index.length >= 1) {
          resultDictionary[document._id.toString()] = timestamps;
          console.log("Timestamps exist for", document._id.toString());
          console.log(timestamps);
        } else {
          console.log("No timestamps found for", document._id.toString());
        }
        
        console.log("test");
      }
  
      // Log the resultDictionary
      console.log("Final Result Dictionary:", resultDictionary);
      return resultDictionary;
    } catch (error) {
      console.error("Error during test:", error);
    }
  }
  

// MongoDB connection
mongoose.connect("mongodb://localhost:27017/keyloud", { useNewUrlParser: true, useUnifiedTopology: true });
const conn = mongoose.connection;

// Check for successful connection
conn.once("open", async () => {
    console.log("Connected to MongoDB");

    // Call the test function after successful connection
    const result = await test(conn);
    // Log the resultDictionary after the function completes
    //console.log(result);
});

// Start the Express server
const port = 5000;
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

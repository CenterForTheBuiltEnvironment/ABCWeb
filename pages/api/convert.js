// Backend logic for converting to JSON format
import { exec } from "child_process";
import { unlink } from "fs";
const path = require("path");
const fs = require("node:fs");

export default function handler(req, res) {
  const isCSV = req.body.csv == true ? "True" : "False";
  const data = req.body.data;

  const filePath = path.join(__dirname, `tempfile-${Date.now()}.csv`);
  fs.writeFile(filePath, data, (err) => {
    if (err) {
      console.error(err);
    }
  });

  const command = `python3 scripts/converter.py ${filePath} ${isCSV}`;

  exec(command, (error, a, b) => {
    if (error) {
      console.error("Error executing script:", error);
      return res.status(500).json({ error: "Failed to run script" });
    }

    const jsonObject = JSON.parse(fs.readFileSync("data.json"));
    // Delete all temp files
    unlink("data.json", (err) => {
      if (err) throw err;
    });
    unlink(filePath, (err) => {
      if (err) throw err;
    });
    return res.status(200).json({ obj: jsonObject });
  });
}

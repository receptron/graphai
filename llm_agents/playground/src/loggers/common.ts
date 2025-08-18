import fs from "fs";
import os from "os";
import path from "path";

const logFile = path.join(os.tmpdir(), "graphai_tmp.log");
console.log(logFile);

export const logger = (message: string) => {
  const line = `[${new Date().toISOString()}] ${message}\n`;
  try {
    fs.appendFileSync(logFile, line);
  } catch (err) {
    console.error("Failed to write log:", err);
  }
};

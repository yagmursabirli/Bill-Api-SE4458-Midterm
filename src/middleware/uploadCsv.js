//src/midlleware/uploadCsv.js
import multer from "multer";

const storage = multer.memoryStorage(); // direkt RAM'de tutuyoruz
export const uploadCsv = multer({ storage });

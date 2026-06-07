import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fileFilter = (req, file, cb) => {
  const isImage = file.mimetype.startsWith("image/");
  if (isImage) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

const createUploader = (folder) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, `../../public/${folder}`));
    },
    filename: (req, file, cb) => {
      const now = Date.now();
      const originalName = file.originalname.replace(/\s+/g, "_");
      cb(null, `${now}-${originalName}`);
    },
  });

  return multer({
    storage,
    fileFilter,
    limits: { fileSize: 50 * 1024 * 1024 },
  });
};

export const profileUpload = () => createUploader("profiles");
export const productsUpload = () => createUploader("products");

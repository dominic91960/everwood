import { customAlphabet } from "nanoid";

const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

const generateOrderId = () => {
  const nanoid = customAlphabet(alphabet, 6);
  return "#" + nanoid();
};

const generateSubfolderId = () => {
  const nanoid = customAlphabet(alphabet, 10);
  const timestamp = new Date()
    .toISOString()
    .replace(/[T:-]/g, "_")
    .split(".")[0];
  return timestamp + nanoid();
};

const generateImageId = () => {
  const nanoid = customAlphabet(alphabet, 10);
  return "IMG_" + nanoid();
};

export { generateOrderId, generateSubfolderId, generateImageId };

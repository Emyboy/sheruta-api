import crypto from "crypto";

export const generateOTP = (length = 6): string => {
  const buffer = crypto.randomBytes(length);

  const token = parseInt(buffer.toString("hex"), 16).toString().slice(
    0,
    length,
  );

  const numericToken = token.padStart(6, "0");

  return numericToken;
};

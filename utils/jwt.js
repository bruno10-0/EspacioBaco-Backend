import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export function createAccessToken(payload) {
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      process.env.PORT.SECRET_KEY,
      {
        expiresIn: "1d",
      },
      (error, token) => {
        if (error) reject(error);
        resolve(token)
      }
    );
  });
}

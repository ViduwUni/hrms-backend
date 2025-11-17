import jwt from "jsonwebtoken";

const generateTokenWithSession = (id, sessionId) => {
  return jwt.sign({ id, sessionId }, process.env.JWT_SECRET, {
    expiresIn: "2h",
  });
};

export default generateTokenWithSession;

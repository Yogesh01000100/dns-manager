import { admin } from "../config/firebase-config.js";

export const createSessionCookie = async (req, res) => {
  const { idToken } = req.body;
  try {
    await admin.auth().verifyIdToken(idToken);
    const expiresIn = 5 * 60 * 1000;
    try {
      const sessionCookie = await admin
        .auth()
        .createSessionCookie(idToken, { expiresIn });
      const options = {
        maxAge: expiresIn,
        httpOnly: true,
        path: "/",
        secure: true, 
        sameSite: 'None',
      };

      res.cookie("session", sessionCookie, options);
      console.log("Cookie set with options:", options);
      res.status(200).json({ status: "success" });
    } catch (error) {
      console.error("Failed to create session cookie:", error);
      res.status(401).send("UNAUTHORIZED REQUEST!");
    }
  } catch (error) {
    console.error("Failed to verify ID token:", error);
    res.status(401).send("UNAUTHORIZED REQUEST!");
  }
};

export const checkSession = async (req, res) => {
  const sessionCookie = req.cookies.session || "";

  if (!sessionCookie) {
    return res.json({
      customStatus: "noSession",
      message: "No session cookie found",
    });
  }

  try {
    const decodedClaims = await admin
      .auth()
      .verifySessionCookie(sessionCookie, true);
    res.json({
      customStatus: "sessionActive",
      decodedClaims,
    });
  } catch (error) {
    res.json({
      customStatus: "sessionExpired",
      message: "Session does not exist or has expired.",
    });
  }
};

export const sessionLogout = async (req, res) => {
  const { token } = req.body;
  const expiresIn = new Date(0);
  const options = {
    maxAge: expiresIn,
    httpOnly: true,
    path: "/",
    secure: true, 
    sameSite: 'None',
  };
  res.cookie("session", token, options);
  console.log("Cookie set with options:", options);
  res.status(200).json({ message: "Logged out successfully" });
};

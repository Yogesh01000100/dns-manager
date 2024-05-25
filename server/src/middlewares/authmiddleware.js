import { admin } from "../config/firebase-config.js";

export async function verifySession(req, res, next) {
    const sessionCookie = req.cookies.session || '';
    try {
        if (!sessionCookie) {
            return res.status(401).json({ error: "Session cookie missing" });
        }
        const decodedClaims = await admin.auth().verifySessionCookie(sessionCookie, true);
        req.decodedClaims = decodedClaims;
        next();
    } catch (error) {
        console.error("Error during session verification:", error);
        res.status(401).json({ error: "Unauthorized: Invalid session cookie" });
    }
}

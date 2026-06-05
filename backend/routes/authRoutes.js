import express from "express";
const router = express.Router();

router.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (username === "admin" && password === "admin123")
        return res.json({ role: "admin", token: "fake-jwt-admin" });
    if (username === "user" && password === "user123")
        return res.json({ role: "user", token: "fake-jwt-user" });

    return res.status(401).json({ message: "Invalid credentials" });
});

router.post("/guest", (req, res) => {
    return res.json({ role: "guest" });
});

export default router;

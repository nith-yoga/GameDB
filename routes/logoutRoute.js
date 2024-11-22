const express = require("express");
const router = express.Router();

router.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: "Error logging out" });
        }
        res.redirect("/login");
    })
});

module.exports = router;
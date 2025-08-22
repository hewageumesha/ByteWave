const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.json({ message: 'Base API endpoint received your request.' });
});

module.exports = router;
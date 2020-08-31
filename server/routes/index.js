const express = require('express');
const router = express.Router();

router.get('/', (req, res) => res.send('What are you doing here?'));

module.exports = router;
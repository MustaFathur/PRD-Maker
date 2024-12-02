const express = require('express');
const router = express.Router();
const personilController = require('../controllers/personilController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.get('/', authMiddleware, personilController.getAllPersonil);
router.get('/:id', authMiddleware, personilController.getPersonilById);
router.post('/', authMiddleware, personilController.createPersonil);
router.put('/:id', authMiddleware, personilController.updatePersonil);
router.delete('/:id', authMiddleware, personilController.deletePersonil);

module.exports = router;
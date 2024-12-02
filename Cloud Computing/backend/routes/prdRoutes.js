const express = require('express');
const router = express.Router();
const prdController = require('../controllers/prdController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.get('/dashboard', authMiddleware, prdController.dashboard);
router.get('/', authMiddleware, prdController.getAllPRDs);
router.post('/', authMiddleware, prdController.createPRD);
router.get('/:id', authMiddleware, prdController.getPRDById);
router.put('/:id/select-source', authMiddleware, prdController.selectSource);
router.put('/:id', authMiddleware, prdController.updatePRD);
router.delete('/:id', authMiddleware, prdController.deletePRD);
router.get('/download/:id', authMiddleware, prdController.downloadPRD);

module.exports = router;
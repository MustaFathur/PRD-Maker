const express = require('express');
const router = express.Router();
const prdController = require('../controllers/prdController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.get('/dashboard', authMiddleware, prdController.dashboard);
router.get('/', authMiddleware, prdController.getAllPRDs);
router.post('/', authMiddleware, prdController.createPRD);
router.get('/:id', authMiddleware, prdController.getPRDById);
router.put('/:id', authMiddleware, prdController.updatePRD);
router.get('/download/:id', authMiddleware, prdController.downloadPRD);
router.put('/archive/:id', authMiddleware, prdController.archivePRD);
router.delete('/:id', authMiddleware, prdController.deletePRD);


module.exports = router;
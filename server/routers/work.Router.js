const express = require('express');
const router = express.Router();
const WorkController = require('./../controllers/work.Controller');
const { verifyToken, checkLogin } = require('./../middlewares/authentication.Middleware');

// Get all work
router.get('/get-all-works', checkLogin, verifyToken, WorkController.getAllWorks);
router.post('/add-work', checkLogin, verifyToken, WorkController.addWork);
router.post('/edit-work', checkLogin, verifyToken, WorkController.editWork);
router.delete('/delete-work', checkLogin, verifyToken, WorkController.deleteWork);
router.post('/find-work', checkLogin, verifyToken, WorkController.findWork);
module.exports = router;
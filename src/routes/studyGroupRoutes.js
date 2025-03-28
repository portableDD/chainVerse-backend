const express = require('express');
const router = express.Router();
const studyGroupController = require('../controllers/studyGroupController');

// Ensure that the controller methods are defined and correctly imported
router.post('/create', studyGroupController.createStudyGroup);
router.post('/join', studyGroupController.joinStudyGroup);
router.get('/all', studyGroupController.getAllStudyGroups);
router.get('/:groupId', studyGroupController.getStudyGroup);
router.post('/:groupId/discussions', studyGroupController.createDiscussion);
router.get('/:groupId/discussions', studyGroupController.getDiscussions);
router.post('/:groupId/files', studyGroupController.uploadFile);
router.get('/:groupId/files', studyGroupController.getFiles);
router.patch('/:groupId/members/:memberId', studyGroupController.updateMembershipStatus);

module.exports = router;
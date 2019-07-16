"use strict";

const express = require('express');
const router = express.Router();

const rewardController = require('../controllers/reward');
/**
 * @swagger
 * tags:
 *   name: Reward
 *   description: Reward types (payout options)
 */

/**
 * @swagger
 *
 * /reward/:
 *   get:
 *     description: Get reward types (payout options)
 *     tags: [Reward]
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: success
 */
router.get('/', rewardController.get);

module.exports = router;
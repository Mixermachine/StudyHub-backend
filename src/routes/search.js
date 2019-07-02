"use strict";

const express = require('express');
const router = express.Router();

const searchController = require('../controllers/search');

/**
 * @swagger
 * tags:
 *   name: Search
 *   description: Search for studies
 */


/**
 * @swagger
 *
 * /search/:
 *   post:
 *     description: Search for studies
 *     tags: [Search]
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - searchText
 *             properties:
 *               searchText:
 *                 type: string
 *               location:
 *                 type: string
 *               organizer:
 *                 type: string
 *               minReward:
 *                 type: integer
 *               rewardType:
 *                 type: string
 *             example: {
 *               "searchText": "Computer Games",
 *               "location": "Garching",
 *               "organizer": "student",
 *               "minReward": "10",
 *               "rewardType": "direct"
 *             }
 *     responses:
 *       200:
 *         description: search successful
 *       501:
 *         description: not all fields provided
 */
router.post('/', searchController.search);

module.exports = router;
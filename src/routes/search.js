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
 * /search/study:
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
 *               city:
 *                 type: string
 *               zip:
 *                 type: string
 *               organizer:
 *                 type: string
 *               minReward:
 *                 type: integer
 *               rewardType:
 *                 type: string
 *             example: {
 *               "searchText": "Games",
 *               "city": "Garching",
 *               "zip": "85748",
 *               "organizer": "s",
 *               "minReward": "5",
 *               "rewardType": "v"
 *             }
 *     responses:
 *       200:
 *         description: search successful
 *       501:
 *         description: not all fields provided
 */
router.post('/study', searchController.searchStudy);

module.exports = router;
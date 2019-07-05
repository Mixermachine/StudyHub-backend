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
 *   get:
 *     description: Search for studies
 *     tags: [Search]
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *        - in: query
 *          name: searchText
 *          schema:
 *            type: string
 *          description: Text input matched to title, description and keywords
 *          example: Games
 *        - in: query
 *          name: city
 *          schema:
 *            type: string
 *          description: The city where the study takes place
 *          example: Garching
 *        - in: query
 *          name: zip
 *          schema:
 *            type: string
 *          description: The zip code where the study takes place
 *          example: 85748
 *        - in: query
 *          name: organizer
 *          schema:
 *            type: string
 *          description: The type of organizer of the study
 *          example: s
 *        - in: query
 *          name: minReward
 *          schema:
 *            type: integer
 *          description: The minimum reward of the study
 *          example: 5
 *        - in: query
 *          name: rewardType
 *          schema:
 *            type: string
 *          description: The type of the reward of the study
 *          example: v
 *     responses:
 *       200:
 *         description: search successful
 *       501:
 *         description: not all fields provided
 */
router.get('/study', searchController.searchStudy);

module.exports = router;
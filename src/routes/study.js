"use strict";

const express = require('express');
const router = express.Router();

const middlewares = require('../middlewares');
const studyController = require('../controllers/study');

/**
 * @swagger
 * tags:
 *   name: Study
 *   description: Study management
 */

/**
 * @swagger
 *
 * /study/{id}:
 *   get:
 *     description: Get data of study. Optional authentication. Creater and payee will get additional information.
 *     tags: [Study]
 *     security:
 *     - {}
 *     - BearerAuth: []
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: created
 *       401:
 *         description: unauthorized
 *       501:
 *         description: not all fields provided
 */
router.get('/:id', middlewares.checkAuthenticationOptional, studyController.get);

/**
 * @swagger
 *
 * /study/participants/{id}:
 *   get:
 *     description: Get participants of a study with their time slot infos.
 *     tags: [Study]
 *     security:
 *     - {}
 *     - BearerAuth: []
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: success
 *       401:
 *         description: unauthorized
 *       501:
 *         description: not all fields provided
 */
router.get('/participants/:id', middlewares.checkAuthentication, studyController.getParticipants);

/**
 * @swagger
 *
 * /study/:
 *   post:
 *     description: Create a study
 *     tags: [Study]
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
 *               - title
 *               - description
 *               - prerequisites
 *               - capacity
 *               - country
 *               - city
 *               - zip
 *               - street
 *               - number
 *               - published
 *               - payeeId
 *             optional:
 *               - additionalLocationInfo
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               prerequisites:
 *                 type: string
 *               capacity:
 *                 type: integer
 *               country:
 *                 type: string
 *               city:
 *                 type: string
 *               zip:
 *                 type: string
 *               street:
 *                 type: string
 *               number:
 *                 type: string
 *               published:
 *                 type: boolean
 *               payeeId:
 *                 type: integer
 *             example: {
 *	             "title": "Test study",
 *               "description": "Lorem ipsum long text",
 *               "prerequisites": "123",
 *               "capacity": "123",
 *               "country": "DE",
 *               "city": "Ismaning",
 *               "zip": "85737",
 *               "street": "Eugenstr",
 *               "number": "4",
 *               "published": "true",
 *               "additionalLocationInfo": "{}",
 *	             "payeeId": "2147400002"
 *             }
 *     responses:
 *       200:
 *         description: created
 *       501:
 *         description: not all fields provided
 */
router.post('/', middlewares.checkAuthentication, studyController.post);

module.exports = router;
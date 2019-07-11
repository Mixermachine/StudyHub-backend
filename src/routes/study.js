"use strict";

const express = require('express');
const router = express.Router();

const middlewares = require('../middlewares');
const studyController = require('../controllers/study');
const timeslotController = require('../controllers/timeslot');

/**
 * @swagger
 * tags:
 *   name: Study
 *   description: Study management
 */

/**
 * @swagger
 *
 * /study/{studyId}:
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
 *         name: studyId
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
router.get('/:studyId', middlewares.checkAuthenticationOptional, studyController.get);

/**
 * @swagger
 *
 * /study/:
 *   post:
 *     description: Create a study
 *     tags: [Study]
 *     security:
 *     - BearerAuth: []
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
 *               - rewardCurrency
 *               - rewardAmount
 *               - rewardType
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
 *               rewardCurrency:
 *                 type: string
 *               rewardAmount:
 *                 type: double
 *               rewardType:
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
 *               "additionalLocationInfo": "{}",
 *               "rewardCurrency": "EUR",
 *               "rewardAmount": "5.0",
 *               "rewardType": "d",
 *               "published": "true",
 *	             "payeeId": "2147400002"
 *             }
 *     responses:
 *       200:
 *         description: created
 *       501:
 *         description: not all fields provided
 */
router.post('/', middlewares.checkAuthentication, studyController.post);

/**
 * @swagger
 *
 * /study/{studyId}/timeslot/:
 *   get:
 *     description: Get all timeslots of a study. Optional authentication. Creater will get additional information.
 *     tags: [Study]
 *     security:
 *     - {}
 *     - BearerAuth: []
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: studyId
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
router.get('/:studyId/timeslot/', middlewares.checkAuthenticationOptional, timeslotController.get);

/**
 * @swagger
 *
 * /study/{studyId}/timeslot/{timeslotId}:
 *   get:
 *     description: Get data for one specific timeslot. Optional authentication. Creater will get additional information.
 *     tags: [Study]
 *     security:
 *     - {}
 *     - BearerAuth: []
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: studyId
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: path
 *         name: timeslotId
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
router.get('/:studyId/timeslot/:timeslotId', middlewares.checkAuthenticationOptional, timeslotController.get);

/**
 * @swagger
 *
 * /study/{studyId}/timeslot/:
 *   post:
 *     description: Create one or many timeslots for a study
 *     tags: [Study]
 *     security:
 *     - BearerAuth: []
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: studyId
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: string
 *               format: date-time
 *             required:
 *               - {start, stop}
 *             properties:
 *               start:
 *                 type: string
 *                 format: date-time
 *               stop:
 *                 type: string
 *                 format: date-time
 *             example: {
 *               "timeslots":[
 *                 {"start":"2019-07-07 10:30:00","stop":"2019-07-07 11:30:00"},
 *                 {"start":"2019-07-07 11:30:00","stop":"2019-07-07 12:30:00"},
 *                 {"start":"2019-07-07 12:30:00","stop":"2019-07-07 13:30:00"}
 *               ]
 *             }
 *     responses:
 *       200:
 *         description: created
 *       501:
 *         description: not all fields provided
 */
router.post('/:studyId/timeslot/', middlewares.checkAuthentication, timeslotController.post);

/**
 * @swagger
 *
 * /study/{studyId}/timeslot/{timeslotId}:
 *   put:
 *     description: Change state of a timeslot. Non creator can only use field
 *     tags: [Study]
 *     security:
 *     - BearerAuth: []
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: studyId
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: path
 *         name: timeslotId
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - start
 *               - stop
 *               - participantId
 *             properties:
 *               start:
 *                 type: string
 *                 format: date-time
 *               stop:
 *                 type: string
 *                 format: date-time
 *               participantId:
 *                 type: integer
 *             example: {
 *	             "start": "2019-07-07 10:30:00",
 *               "stop": "2019-07-07 11:30:00",
 *               "participantId": 1
 *             }
 *     responses:
 *       200:
 *         description: created
 *       501:
 *         description: not all fields provided
 */
router.put('/:studyId/timeslot/:timeslotId/', middlewares.checkAuthentication, timeslotController.put);

module.exports = router;
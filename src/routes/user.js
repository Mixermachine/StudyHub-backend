"use strict";

const express = require('express');
const router = express.Router();

const middlewares = require('../middlewares');
const userController = require('../controllers/user');

const creatorController = require('../controllers/creator');
const payeeController = require('../controllers/payee');
const participantController = require('../controllers/participant');

//router.post('/', middlewares.checkAuthentication, userController.create); // Create a new movie

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User management and login
 */

/**
 * @swagger
 *
 * /user/:
 *   post:
 *     description: Create a user
 *     tags: [User]
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
 *               - firstName
 *               - lastName
 *               - DoB
 *               - gender
 *               - email
 *               - password
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               DoB:
 *                 type: string
 *                 format: date
 *               gender:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             example: {
 *               "firstName": "John",
 *               "lastName": "Doe",
 *               "DoB": "1993-01-01",
 *               "gender": "f",
 *               "email": "invalid@invalid.com",
 *               "password": "123"
 *             }
 *     responses:
 *       200:
 *         description: created
 *       501:
 *         description: not all fields provided
 */
//TODO: put update user, only what is submitted
//TODO: search
router.post('/', userController.create);

/**
 * @swagger
 *
 * /user/{id}:
 *   get:
 *     description: Get data of user. With optional authentication the email will be provided.
 *     tags: [User]
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
router.get('/:id', middlewares.checkAuthenticationOptional, userController.get);

/**
 * @swagger
 *
 * /user/creator/{id}:
 *   get:
 *     description: Check if user is a creator
 *     tags: [User]
 *     security:
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
 *         description: is creator
 *       401:
 *         description: unauthorized
 *       501:
 *         description: id not provided
 */
router.get('/creator/:id', middlewares.checkAuthentication, creatorController.get);

/**
 * @swagger
 *
 * /user/creator:
 *   post:
 *     description: Make user a creator
 *     tags: [User]
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
 *               - id
 *             properties:
 *               id:
 *                 type: string
 *             example: {
 *               "id": 1
 *             }
 *     responses:
 *       200:
 *         description: user is creator now
 *       401:
 *         description: unauthorized
 *       501:
 *         description: id not provided
 */
router.post('/creator/', middlewares.checkAuthentication, creatorController.post);

/**
 * @swagger
 *
 * /user/payee/{id}:
 *   get:
 *     description: Check if user is a payee
 *     tags: [User]
 *     security:
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
 *         description: is payee
 *       401:
 *         description: unauthorized
 *       501:
 *         description: id not provided
 */
router.get('/payee/:id', middlewares.checkAuthentication, payeeController.get);

/**
 * @swagger
 *
 * /user/payee:
 *   post:
 *     description: Make user a payee
 *     tags: [User]
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
 *               - id
 *             properties:
 *               id:
 *                 type: string
 *             example: {
 *               "id": 1
 *             }
 *     responses:
 *       200:
 *         description: user is payee now
 *       401:
 *         description: unauthorized
 *       501:
 *         description: id not provided
 */
router.post('/payee/', middlewares.checkAuthentication, payeeController.post);

/**
 * @swagger
 *
 * /user/participant/{id}:
 *   get:
 *     description: Check if user is a participant
 *     tags: [User]
 *     security:
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
 *         description: is participant
 *       401:
 *         description: unauthorized
 *       501:
 *         description: id not provided
 */
router.get('/participant/:id', middlewares.checkAuthentication, participantController.get);

/**
 * @swagger
 *
 * /user/payee:
 *   post:
 *     description: Make user a participant
 *     tags: [User]
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
 *               - id
 *             properties:
 *               id:
 *                 type: string
 *             example: {
 *               "id": 1
 *             }
 *     responses:
 *       200:
 *         description: user is participant now
 *       401:
 *         description: unauthorized
 *       501:
 *         description: id not provided
 */
router.post('/participant', middlewares.checkAuthentication, participantController.post);


/**
 * @swagger
 *
 * /user/:
 *   put:
 *     description: Change data of a user
 *     tags: [User]
 *     security:
 *       - {}
 *       - BearerAuth: []
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
 *               - id
 *             properties:
 *               id:
 *                 type: integer
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               DoB:
 *                 type: string
 *                 format: date
 *               gender:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             example: {
 *               "id": "1",
 *               "firstName": "John",
 *               "lastName": "Doe",
 *               "DoB": "1993-01-01",
 *               "gender": "f",
 *               "email": "invalid@invalid.com",
 *               "password": "123"
 *             }
 *     responses:
 *       200:
 *         description: update successful
 *       501:
 *         description: id not provided
 */
router.put('/', middlewares.checkAuthentication, userController.put);

module.exports = router;
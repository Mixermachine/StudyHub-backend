"use strict";

const express = require('express');
const router = express.Router();

const middlewares = require('../middlewares');
const userController = require('../controllers/user');


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
 * /user/:
 *   get:
 *     description: Get profile of signed in user
 *     tags: [User]
 *     security:
 *     - BearerAuth: []
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: created
 *       401:
 *         description: unauthorized
 *       501:
 *         description: not all fields provided
 */
router.get('/', middlewares.checkAuthentication, userController.get);

//router.get('/', userController.get);
//router.get('/:id', userController.read); // Read a movie by Id
//router.put('/:id', middlewares.checkAuthentication, userController.update); // Update a movie by Id


module.exports = router;
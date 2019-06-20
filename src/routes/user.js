"use strict";

const express = require('express');
const router = express.Router();

const middlewares = require('../middlewares');
const userController = require('../controllers/user');


//router.post('/', middlewares.checkAuthentication, userController.create); // Create a new movie

/**
 * @swagger
 *
 * /user/:
 *   post:
 *     description: Create a user
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: body
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           required:
 *             - firstName
 *             - lastName
 *             - DoB
 *             - gender
 *             - email
 *             - password
 *           properties:
 *             firstName:
 *               type: string
 *             lastName:
 *               type: string
 *             DoB:
 *               type: string
 *               format: date
 *             gender:
 *               type: string
 *             email:
 *               type: string
 *             password:
 *               type: string
 *           example: {
 *             "firstName": "John",
 *             "lastName": "Doe",
 *             "DoB": "1993-01-01",
 *             "gender": "f",
 *             "email": "invalid@invalid.com",
 *             "password": "123"
 *           }
 *     responses:
 *       200:
 *         description: created
 *       501:
 *         description: not all fields provided
 */
router.post('/', userController.create);
//router.get('/:id', userController.read); // Read a movie by Id
//router.put('/:id', middlewares.checkAuthentication, userController.update); // Update a movie by Id


module.exports = router;
"use strict";

const express = require('express');
const router = express.Router();

const middlewares = require('../middlewares');
const AuthController = require('../controllers/auth');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication
 */

/**
 * @swagger
 *
 * /auth/login:
 *   post:
 *     description: Login to receive Bearer token
 *     tags: [Auth]
 *     produces:
 *       - application/json
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             example: {
 *               "email": "test@test.com",
 *               "password": "studyhub"
 *             }
 *     responses:
 *       200:
 *         description: Login successful
 *       404:
 *         description: Email not found.
 */
router.post('/login', AuthController.login);

/**
 * @swagger
 *
 * /auth/logout:
 *   post:
 *     description: Check if logged in
 *     tags: [Auth]
 *     security:
 *     - BearerAuth: []
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Logout successful
 *       400:
 *         description: Bad request. Token was not prefixed with Bearer.
 *           https://swagger.io/docs/specification/authentication/bearer-authentication/
 *       401:
 *         description: Unauthorized. Empty, wrong or malformed token
 */
router.get('/logout', middlewares.checkAuthentication, AuthController.logout);

module.exports = router;
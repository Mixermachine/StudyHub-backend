"use strict";

const express = require('express');
const router = express.Router();

const middlewares = require('../middlewares');
const studyController = require('../controllers/study');

router.get('/', middlewares.checkAuthentication, studyController.get);
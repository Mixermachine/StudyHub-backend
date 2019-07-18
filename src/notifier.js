"use strict";

const config = require('./config').config;
const template = require('./messageTemplateProvider');
const models = require('./models');
const logger = require('./logger')("notifier");

const mailProvider = require('gmail-send')({
    user: config.email,
    pass: config.emailPass,
});

const sendMail = (email, subject, message) => {
    if (email) {
        mailProvider({to: email, subject: subject, text: message}, function (err, res) {
            if (err) {
                logger.error(err.message);
            }

            logger.info("Sending email to user was successful. Response: " + res);
        })
    } else {
        throw "Email not provided"
    }
};

const sendTemplateEmail = (email, template) => {
    return sendMail(email, template.subject, template.message);
};

const getUser = (userId) => {
    return models.User.findByPk(userId);
};

const notifyUserWithTemplate = (userId, template) => {
    return getUser(userId)
        .then(user => {
            if (user) {
                logger.info("Notifying user " + user.id + " about subject: " + template.subject);
                sendTemplateEmail(user.email, template);
            }
        })
};

const notifyUserWithFreeText = (userId, subject, message) => {
    const tempTemplate = template.getEmptyTemplate();
    tempTemplate.subject = subject;
    tempTemplate.message = message;
    return notifyUserWithTemplate(userId, tempTemplate);
};

module.exports = {
    notifyUserWithTemplate,
    notifyUserWithFreeText
};
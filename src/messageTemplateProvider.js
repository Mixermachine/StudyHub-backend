"use strict";

const getEmptyTemplate = () => {
    return {subject: "", message: ""};
};

const greeting = "Best regards\n" +
    "Your Studyhub Team";

const studyHasBeenBooked = (options) => {
    const template = getEmptyTemplate();
    template.subject = "A timeslot has been booked for you";
    template.message = "A timeslot in the study " + options.study.title + " has been booked for you.\n" +
        "The appointment will take place from " + options.timeslot.start + " to " + options.timeslot.stop + "\n" +
        greeting;
    return template;
};

const studyHasBeenUnBooked = (options) => {
    const template = getEmptyTemplate();
    template.subject = "A timeslot has been unbooked for you";
    template.message = "The timeslot in the study " + options.study.title + " is no longer reserved for you.\n" +
        "You were booked out of the appointment from " + options.timeslot.start + " to " + options.timeslot.stop + ".\n" +
        greeting;
    return template;
};

module.exports = {
    getEmptyTemplate,
    studyHasBeenBooked,
    studyHasBeenUnBooked
};
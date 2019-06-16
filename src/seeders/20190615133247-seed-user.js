'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {

        return queryInterface.bulkInsert('Users', [{
            firstName: 'John',
            lastName: 'Doe',
            DoB: ''
        }, {
            firstName: 'Doe',
            lastName: 'John'
        }
        ], {});
    },

    down: (queryInterface, Sequelize) => {
        /*
          Add reverting commands here.
          Return a promise to correctly handle asynchronicity.

          Example:
          return queryInterface.bulkDelete('People', null, {});

          Caution: Just to be safe, don't add delete step.
          If this is executed on a live system by accident, this will fry the database
        */
    }
};

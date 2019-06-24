'use strict';

const userIds = [2147400001, 2147400002, 2147400003];
const studyIds = [2147400001];


module.exports = {
    up: (queryInterface) => {

        /* User with PW, Payee...*/

        return queryInterface.bulkInsert('Users', [{
            id: userIds[0],
            firstName: 'John',
            lastName: 'Doe',
            DoB: '1993-01-01',
            gender: 'm',
            pwHash: '$10$IW.DpFpWt7fkuxVvZ2hg7OZJGkycY4gHaXH7jNSxhOwUPquAJaKPW',
            email: 'test@test.com',
            createdOn: '2019-06-20 12:18:12',
            modifiedOn: '2019-06-20 12:18:12'

        }, {
            id: userIds[1],
            firstName: 'Jane',
            lastName: 'Doe',
            DoB: '1994-02-03',
            gender: 'f',
            pwHash: '$10$IW.DpFpWt7fkuxVvZ2hg7OZJGkycY4gHaXH7jNSxhOwUPquAJaKPW',
            email: 'test2@test.com',
            createdOn: '2019-06-20 13:38:11',
            modifiedOn: '2019-06-20 13:38:11'

        }, {
            id: userIds[2],
            firstName: 'Study',
            lastName: 'Payee',
            DoB: '1993-02-22',
            gender: 'f',
            pwHash: '$10$IW.DpFpWt7fkuxVvZ2hg7OZJGkycY4gHaXH7jNSxhOwUPquAJaKPW',
            email: 'test3@test.com',
            createdOn: '2019-06-19 11:25:33',
            modifiedOn: '2019-06-19 11:25:33'
        }

        ], {}).then(() => {
            return queryInterface.bulkInsert('Participants', [{
                userId: userIds[0],
                balance: '0'
            }, {
                userId: userIds[1],
                balance: '5'
            }

            ], {})
        }).then(() => {
            return queryInterface.bulkInsert('Payees', [{
                userId: userIds[2]
            }

            ], {})
        }).then(() => {
            return queryInterface.bulkInsert('Creators', [{
                userId: userIds[2]
            }

            ], {})
        }).then(() => {
            return queryInterface.bulkInsert('Studies', [{
                id: studyIds[0],
                title: 'Electric fans study',
                description: 'Experiment on the beneficial effect of electric fans in extreme heat and humidity.',
                prerequisites: 'None',
                capacity: '25',
                country: 'DE',
                city: 'Garching',
                zip: '85748',
                street: 'Bolzmannstraße',
                number: '3',
                additionalLocationInfo: '{\n' +
                    '  "room": "03.10.011"\n' +
                    '}',
                published: 'true',
                creatorId: userIds[2],
                payeeId: userIds[2]
            }

            ], {})
        }).then(() => {
            return queryInterface.bulkInsert('StudyKeywords', [{
                studyId: studyIds[0],
                keyword: 'fan'
            }, {
                studyId: studyIds[0],
                keyword: 'heat'
            }, {
                studyId: studyIds[0],
                keyword: 'humidity'
            }

            ], {})
        }).then(() => {
            return queryInterface.bulkInsert('Timeslots', [{
                start: '2019-06-25 12:00:00',
                stop: '2019-06-25 12:30:00',
                attended: 'true',
                studyId: studyIds[0],
                participantId: userIds[0]
            }, {
                start: '2019-06-26 12:30:00',
                stop: '2019-06-26 13:00:00',
                attended: 'false',
                studyId: studyIds[0],
                participantId: userIds[1]
            }, {
                start: '2019-06-26 13:00:00',
                stop: '2019-06-26 13:30:00',
                attended: 'false',
                studyId: studyIds[0],
            }

            ], {})
        });
    },

    down: (queryInterface, Sequelize) => {


        return queryInterface.bulkDelete(
            'Timeslots',
            {studyId: {[Sequelize.Op.in]: studyIds}}
        ).then(() => {
            return queryInterface.bulkDelete(
                'StudyKeywords',
                {studyId: {[Sequelize.Op.in]: studyIds}}
            )
        }).then(() => {
            return queryInterface.bulkDelete(
                'Studies',
                {id: {[Sequelize.Op.in]: studyIds}}
            )
        }).then(() => {
            return queryInterface.bulkDelete(
                'Creators',
                {userId: {[Sequelize.Op.in]: userIds}}
            )
        }).then(() => {
            return queryInterface.bulkDelete(
                'Payees',
                {userId: {[Sequelize.Op.in]: userIds}}
            )
        }).then(() => {
            return queryInterface.bulkDelete(
                'Participants',
                {userId: {[Sequelize.Op.in]: userIds}}
            )
        }).then(() => {
            return queryInterface.bulkDelete(
                'Users',
                {id: {[Sequelize.Op.in]: userIds}}
            )
        });
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

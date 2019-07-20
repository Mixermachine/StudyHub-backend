'use strict';

const userIds = [2147400001, 2147400002, 2147400003, 2147400004];
const studyIds = [2147400001, 2147400002, 2147400003];
const rewardTypeIds = [2147400001, 2147400002, 2147400003];
const payoutMethodIds = [2147400001, 2147400002];


module.exports = {
    up: (queryInterface) => {

        /* User with PW, Payee...*/

        return queryInterface.bulkInsert('Users', [{
            id: userIds[0],
            firstName: 'John',
            lastName: 'Doe',
            DoB: '1993-01-01',
            gender: 'm',
            pwHash: '$2a$10$jpy7DA15sqVoirVrJWCatOdhKBzJICkiFogGzLCRaTJNHNWUouTI2',
            email: 'test@test.com',
            createdOn: '2019-06-20 12:18:12',
            modifiedOn: '2019-06-20 12:18:12'

        }, {
            id: userIds[1],
            firstName: 'Jane',
            lastName: 'Doe',
            DoB: '1994-02-03',
            gender: 'f',
            pwHash: '$2a$10$jpy7DA15sqVoirVrJWCatOdhKBzJICkiFogGzLCRaTJNHNWUouTI2',
            email: 'test2@test.com',
            createdOn: '2019-06-20 13:38:11',
            modifiedOn: '2019-06-20 13:38:11'

        }, {
            id: userIds[2],
            firstName: 'Student',
            lastName: 'StudyMaker',
            DoB: '1990-05-17',
            gender: 'm',
            pwHash: '$2a$10$jpy7DA15sqVoirVrJWCatOdhKBzJICkiFogGzLCRaTJNHNWUouTI2',
            email: 'test3@test.com',
            createdOn: '2019-06-19 11:25:33',
            modifiedOn: '2019-06-19 11:25:33'
        }, {
            id: userIds[3],
            firstName: 'Study',
            lastName: 'Payee',
            DoB: '1993-02-22',
            gender: 'f',
            pwHash: '$2a$10$jpy7DA15sqVoirVrJWCatOdhKBzJICkiFogGzLCRaTJNHNWUouTI2',
            email: 'test4@test.com',
            createdOn: '2019-07-01 19:16:22',
            modifiedOn: '2019-07-01 19:16:22'
        }

        ], {}).then(() => {
            return queryInterface.bulkInsert('Participants', [{
                userId: userIds[0]
            }, {
                userId: userIds[1]
            }

            ], {})
        }).then(() => {
            return queryInterface.bulkInsert('Payees', [{
                userId: userIds[2]
            }, {
                userId: userIds[3]
            }

            ], {})
        }).then(() => {
            return queryInterface.bulkInsert('Creators', [{
                userId: userIds[2],
                organizerType: "s"
            }, {
                userId: userIds[3],
                organizerType: "e"
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
                rewardCurrency: "EUR",
                rewardAmount: "5.0",
                published: 'true',
                creatorId: userIds[2],
                payeeId: userIds[2],
                createdOn: '2019-06-20 12:18:12'
            }, {
                id: studyIds[1],
                title: 'Study to find good computer games!',
                description: 'We show you computer games and you tell us if you like them...',
                prerequisites: 'Needs to like gaming',
                capacity: '20',
                country: 'DE',
                city: 'München',
                zip: '81539',
                street: 'Rosenheimerstraße',
                number: '14a',
                additionalLocationInfo: '{}',
                rewardCurrency: "EUR",
                rewardAmount: "10.0",
                published: 'true',
                creatorId: userIds[3],
                payeeId: userIds[3],
                createdOn: '2019-06-21 12:18:12'
            }, {
                id: studyIds[2],
                title: 'Games and friends',
                description: 'This study tries to determine if people who play any sort of games have more or less friends then others.',
                prerequisites: '',
                capacity: '50',
                country: 'DE',
                city: 'Garching',
                zip: '85748',
                street: 'Bolzmannstraße',
                number: '3',
                additionalLocationInfo: '{\n' +
                    '  "room": "07.8.009"\n' +
                    '}',
                rewardCurrency: "USD",
                rewardAmount: "7.5",
                published: 'true',
                creatorId: userIds[2],
                payeeId: userIds[3],
                createdOn: '2019-06-22 12:18:12'
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
            }, {
                studyId: studyIds[1],
                keyword: 'games'
            }, {
                studyId: studyIds[1],
                keyword: 'computer'
            }, {
                studyId: studyIds[2],
                keyword: 'friends'
            }, {
                studyId: studyIds[2],
                keyword: 'video'
            }, {
                studyId: studyIds[2],
                keyword: 'games'
            }, {
                studyId: studyIds[2],
                keyword: 'board'
            }

            ], {})
        }).then(() => {
            return queryInterface.bulkInsert('RewardTypes', [{
                id: rewardTypeIds[0],
                name: 'PayPal'
            }, {
                id: rewardTypeIds[1],
                name: 'IBAN'
            }, {
                id: rewardTypeIds[2],
                name: 'Amazon gift card'
            }

            ], {})
        }).then(() => {
            return queryInterface.bulkInsert('PayoutMethods', [{
                id: payoutMethodIds[0],
                date: '2019-06-06',
                participantId: userIds[0],
                rewardTypeId: rewardTypeIds[0],
                paymentInfo: 'test@test.com'
            }, {
                id: payoutMethodIds[1],
                date: '2019-07-07',
                participantId: userIds[1],
                rewardTypeId: rewardTypeIds[1],
                paymentInfo: 'test2@test.com'
            }

            ], {})
        }).then(() => {
            return queryInterface.bulkInsert('Timeslots', [{
                start: '2019-06-25 12:00:00',
                stop: '2019-06-25 12:30:00',
                attended: 'true',
                studyId: studyIds[0],
                participantId: userIds[0],
                payoutMethodId: payoutMethodIds[0]
            }, {
                start: '2019-06-26 12:30:00',
                stop: '2019-06-26 13:00:00',
                attended: 'false',
                studyId: studyIds[0],
                participantId: userIds[1],
                payoutMethodId: payoutMethodIds[1]
            }, {
                start: '2019-06-26 13:00:00',
                stop: '2019-06-26 13:30:00',
                attended: 'false',
                studyId: studyIds[0]
            }, {
                start: '2019-06-25 12:00:00',
                stop: '2019-06-25 12:30:00',
                attended: 'true',
                studyId: studyIds[1],
                participantId: userIds[0],
                payoutMethodId: payoutMethodIds[0]
            }, {
                start: '2019-06-30 12:30:00',
                stop: '2019-06-30 13:00:00',
                attended: 'false',
                studyId: studyIds[1]
            }, {
                start: '2019-06-30 13:00:00',
                stop: '2019-06-30 13:30:00',
                attended: 'false',
                studyId: studyIds[1],
                participantId: userIds[1],
                payoutMethodId: payoutMethodIds[1]
            }, {
                start: '2019-06-30 12:00:00',
                stop: '2019-06-30 12:30:00',
                attended: 'false',
                studyId: studyIds[2]
            }, {
                start: '2019-06-26 12:30:00',
                stop: '2019-06-26 13:00:00',
                attended: 'false',
                studyId: studyIds[2]
            }, {
                start: '2019-06-26 13:00:00',
                stop: '2019-06-26 13:30:00',
                attended: 'false',
                studyId: studyIds[2],
                participantId: userIds[1],
                payoutMethodId: payoutMethodIds[1]
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
                'PayoutMethods',
                {id: {[Sequelize.Op.in]: payoutMethodIds}}
            )
        }).then(() => {
            return queryInterface.bulkDelete(
                'RewardTypes',
                {id: {[Sequelize.Op.in]: rewardTypeIds}}
            )
        }).then(() => {
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

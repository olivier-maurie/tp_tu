const request = require('supertest')
const chai = require('chai')
const expect = chai.expect
chai.should()


const { find } = require('lodash');

const db = require('../../data/db');
const app = require('../../app');

const listItemFixtures = require('../fixtures/listItem');

describe('CourselistController', () => {
    beforeEach(() => {
        listItemFixtures.up()
    });
    afterEach(() => {
        listItemFixtures.down()
    });

    describe('When I create a courseList (POST /course-lists)', () => {
        it('should reject with a 400 when no name is given', () => {
            return request(app).post('/course-lists/1/list-item').then((res) => {
                res.status.should.equal(400);
                res.body.should.eql({
                    error: {
                        code: 'VALIDATION',
                        message: 'Missing item name'
                    }
                })
            })
        });

        it('should reject when item name is not unique', () => {
            return request(app)
                .post('/course-lists/1/list-item')
                .send({ item_name: 'Mon item' })
                .then((res) => {
                    res.status.should.equal(400)
                    res.body.should.eql({
                        error: {
                            code: 'VALIDATION',
                            message: 'An item with this name already exist'
                        }
                    })
                })
        })
    })
})

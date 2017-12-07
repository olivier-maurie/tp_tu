const request = require('supertest')
const chai = require('chai')
const expect = chai.expect
chai.should()


const { find } = require('lodash');

const db = require('../../data/db');
const app = require('../../app');

const listItemFixtures = require('../fixtures/listItem');

describe('listItemController', () => {
    beforeEach(() => {
        listItemFixtures.up()
    });
    afterEach(() => {
        listItemFixtures.down()
    });

    describe('When I add course item (POST /course-lists/:id/list-item)', () => {
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

        it('should reject when article is not unique', () => {
            return request(app)
                .post('/course-lists/1/list-item')
                .send({article: 'Mon item'})
                .then((res) => {
                    res.status.should.equal(400)
                    res.body.should.eql({
                        error: {
                            code: 'VALIDATION',
                            message: 'An item with this name already exist'
                        }
                    })
                })
        });

        it('should succesfuly create an item for a course list', () => {
            const item_name = 'Mon deuxiéme item';

            return request(app)
                .post('/course-lists/1/list-item')
                .send({article: item_name})
                .then((res) => {
                    res.status.should.equal(200);
                    expect(res.body.data).to.be.an('object');
                    res.body.data.article.should.equal(item_name);

                })
        })
    })

    describe('When I get course item from course list id (GET /course-lists/:id/list-item)', () => {

        it('should reject when courselist don\'t exist', () => {
            return request(app)
                .get('/course-lists/5/list-item')
                .then((res) => {
                    res.status.should.equal(400)
                    res.body.should.eql({
                        error: {
                            code: 'VALIDATION',
                            message: 'There no course list with this id'
                        }
                    })
                })
        });

        it('should succesfuly get all items from a course list', () => {
            return request(app)
                .get('/course-lists/1/list-item')
                .then((res) => {
                    res.status.should.equal(200);
                    res.body.data[0].article.should.equal("Mon item");
                    res.body.data[1].article.should.equal("Mon deuxiéme item");
                })
        })
    })

    describe('When I buy a course item from course list id (PUT /course-lists/:id/list-item)', () => {

        it('should reject with a 400 when no name is given', () => {
            return request(app).put('/course-lists/1/list-item').then((res) => {
                res.status.should.equal(400);
                res.body.should.eql({
                    error: {
                        code: 'VALIDATION',
                        message: 'Missing item name'
                    }
                })
            })
        });

        it('should reject when courselist don\'t exist', () => {
            return request(app)
                .put('/course-lists/5/list-item')
                .send({article: 'Mon item'})
                .then((res) => {
                    res.status.should.equal(400)
                    res.body.should.eql({
                        error: {
                            code: 'VALIDATION',
                            message: 'There no course list with this id'
                        }
                    })
                })
        });

        it('should reject when article not exist', () => {
            return request(app)
                .put('/course-lists/1/list-item')
                .send({article: 'Mon item imaginaire'})
                .then((res) => {
                    res.status.should.equal(400);
                    res.body.should.eql({
                        error: {
                            code: 'VALIDATION',
                            message: 'There no article in this course list with this name'
                        }
                    })
                })
        });

        it('should successfully flag the article as bought', () => {
            return request(app)
                .put('/course-lists/1/list-item')
                .send({article: 'Mon item'})
                .then((res) => {
                    res.status.should.equal(200);
                    res.body.data.should.eql({
                        article: "Mon item",
                        bought: true
                    })
                })
        });
    })
})

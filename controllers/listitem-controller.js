const express = require('express');
const router = express.Router();
const BadRequestError = require('../errors/bad-request');

const db = require('../data/db');
const courseListCollection = db.courseList;

router.post('/:id/list-item', (req, res, next) => {

    if (!req.body.article) {
        return next(new BadRequestError('VALIDATION', 'Missing item name'))
    }

    const article = req.body.article;
    const id = parseInt(req.params.id);

    let isDuplicateName = false;

    courseListCollection.forEach(function(item_list) {
        if (item_list.id === id) {
            item_list.items.forEach(function(item) {
                if (item.article === article) {
                    isDuplicateName = true;
                }
            });
            if (!isDuplicateName) {
                item_list.items.push({"article": article, "bought": false})
            }
        }
    });

    if (isDuplicateName) {
        return next(new BadRequestError('VALIDATION', 'An item with this name already exist'))
    }

    res.json({
        data: {
            article: article,
            bought: false
        }
    })
});

router.get('/:id/list-item', (req, res, next) => {

    let listExist = false;

    const id = parseInt(req.params.id);

    let data = {};

    courseListCollection.forEach(function(item_list) {
        if (item_list.id === id) {
            listExist = true;
            data = item_list.items;
        }
    });

    if (!listExist) {
        return next(new BadRequestError('VALIDATION', 'There no course list with this id'))
    }

    res.json({
        data
    })
});

router.put('/:id/list-item', (req, res, next) => {

    let listExist = false;
    let itemExist = false;
    const id = parseInt(req.params.id);

    if (!req.body.article) {
        return next(new BadRequestError('VALIDATION', 'Missing item name'))
    }

    const article = req.body.article

    let data = {};

    courseListCollection.forEach(function(item_list) {
        if (item_list.id === id) {
            listExist = true;
            data = item_list.items;

            item_list.items.forEach(function(item) {
                if (item.article === article) {
                    itemExist = true;
                    item.bought = true;

                    data = item;
                }
            });
        }
    });

    if (!listExist) {
        return next(new BadRequestError('VALIDATION', 'There no course list with this id'))
    }

    if (!itemExist) {
        return next(new BadRequestError('VALIDATION', 'There no article in this course list with this name'))
    }

    res.json({
        data
    })
});

module.exports = router;
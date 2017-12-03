const express = require('express')
const router = express.Router()
const BadRequestError = require('../errors/bad-request')
const { find } = require('lodash')

const db = require('../data/db')
const courseListCollection = db.courseList

router.post('/:id/list-item', (req, res, next) => {

    if (!req.body.item_name) {
        return next(new BadRequestError('VALIDATION', 'Missing item name'))
    }

    const item_name = req.body.item_name;
    const id = parseInt(req.params.id);

    let isDuplicateName = false;

    courseListCollection.forEach(function(item_list) {
        if (item_list.id === id) {
            item_list.items.forEach(function(item) {
                if (item.item === item_name) {
                    isDuplicateName = true;
                }
            })
            if (!isDuplicateName) {
                item.items.push({"course": item_name, "bought": false})
            }
        }
    });

    if (isDuplicateName) {

        return next(new BadRequestError('VALIDATION', 'An item with this name already exist'))
    }

    res.json({
        course: item_name,
        bought: false
    })
});

module.exports = router;
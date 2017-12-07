const { courseList } = require('../../data/db')

mockData = [
    { id: 1, name: 'Toto', items: [{article: 'Mon item', bought: false}] },
    { id: 2, name: 'Ma liste', items: [] }
]

module.exports = {
    up: () => {
        courseList.splice(0);
        courseList.push.apply(courseList, mockData)
    },

    down: () => {
        courseList.splice(0)
    }
};
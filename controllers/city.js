const models = require('../models')
const mongoose = require('mongoose')
const Promise = require('bluebird')
mongoose.Promise = Promise

exports.create = function (req, res, next) {
  if (Array.isArray(req.body)) {
    Promise.all(req.body.map(c => {
      const city = new models.City(c)
      return city.save()
    }))
    .then(() => res.send(req.body))
    .catch(err => next(err))
  }
  else {
    const city = new models.City(req.body)
    city.save()
    .then(() => res.send(city))
    .catch(err => next(err))
  }
}

exports.find = function (req, res, next) {
  models.City.find(req.query).exec()
  .then((docs) => res.send(docs))
  .catch(err => next(err))
}

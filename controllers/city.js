const models = require('../models')
const mongoose = require('mongoose')
const Promise = require('bluebird')
mongoose.Promise = Promise

exports.create = function (req, res, next) {
  const city = new models.City(req.body)
  city.save()
  .then(() => res.send(city))
  .catch(err => next(err))
}

exports.find = function (req, res, next) {
  models.City.find(req.query).exec()
  .then((docs) => res.send(docs))
  .catch(err => next(err))
}

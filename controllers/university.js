const models = require('../models')
const mongoose = require('mongoose')
const Promise = require('bluebird')
mongoose.Promise = Promise

exports.create = function (req, res, next) {
  const university = new models.University(req.body)
  university.save()
  .then(() => res.send(university))
  .catch(err => next(err))
}

exports.find = function (req, res, next) {
  models.University.find(req.query).exec()
  .then((docs) => res.send(docs))
  .catch(err => next(err))
}

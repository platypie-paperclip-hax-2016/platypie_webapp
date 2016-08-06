const models = require('../models')
const mongoose = require('mongoose')
const Promise = require('bluebird')
mongoose.Promise = Promise

exports.create = function (req, res, next) {
  const major = new models.Major(req.body)
  major.save()
  .then(() => res.send(major))
  .catch(err => next(err))
}

exports.find = function (req, res, next) {
  models.Major.find(req.query).exec()
  .then((docs) => res.send(docs))
  .catch(err => next(err))
}

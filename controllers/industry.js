const models = require('../models')
const mongoose = require('mongoose')
const Promise = require('bluebird')
mongoose.Promise = Promise

exports.create = function (req, res, next) {
  const industry = new models.Industry(req.body)
  industry.save()
  .then(() => res.send(industry))
  .catch(err => next(err))
}

exports.find = function (req, res, next) {
  models.Industry.find(req.query).exec()
  .then((docs) => res.send(docs))
  .catch(err => next(err))
}

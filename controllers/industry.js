const models = require('../models')
const mongoose = require('mongoose')
const Promise = require('bluebird')
mongoose.Promise = Promise

exports.create = function (req, res, next) {
  if (Array.isArray(req.body)) {
    Promise.all(req.body.map(i => {
      const industry = new models.Industry(i)
      return industry.save()
    }))
    .then(() => res.send(req.body))
    .catch(err => next(err))
  }
  else {
    const industry = new models.Industry(req.body)
    industry.save()
    .then(() => res.send(industry))
    .catch(err => next(err))
  }
}

exports.find = function (req, res, next) {
  models.Industry.find(req.query).exec()
  .then((docs) => res.send(docs))
  .catch(err => next(err))
}

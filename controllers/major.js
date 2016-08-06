const models = require('../models')
const mongoose = require('mongoose')
const Promise = require('bluebird')
mongoose.Promise = Promise

exports.create = function (req, res, next) {
  if (Array.isArray(req.body)) {
    Promise.all(req.body.map(m => {
      const major = new models.Major(m)
      return major.save()
    }))
    .then(() => res.send(req.body))
    .catch(err => next(err))
  }
  else {
    const major = new models.Major(req.body)
    major.save()
    .then(() => res.send(major))
    .catch(err => next(err))
  }
}

exports.find = function (req, res, next) {
  models.Major.find(req.query).exec()
  .then((docs) => res.send(docs))
  .catch(err => next(err))
}

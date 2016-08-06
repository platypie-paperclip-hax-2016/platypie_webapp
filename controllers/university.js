const models = require('../models')
const mongoose = require('mongoose')
const Promise = require('bluebird')
mongoose.Promise = Promise

exports.create = function (req, res, next) {
  if (Array.isArray(req.body)) {
    Promise.all(req.body.map(u => {
      const university = new models.University(u)
      return university.save()
    }))
    .then(() => res.send(req.body))
    .catch(err => next(err))
  } 
  else {
    const university = new models.University(req.body)
    university.save()
    .then(() => res.send(university))
    .catch(err => next(err))
  }
}

exports.find = function (req, res, next) {
  models.University.find(req.query).exec()
  .then((docs) => res.send(docs))
  .catch(err => next(err))
}

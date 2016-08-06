var fbMessage = require("../utils").fbMessage
var models = require("../models")
var User = require("../models/User")
var Wit = require("node-wit").Wit

function witWrapper(store) {

    var actions = {
        send: function (request, response) {
            console.log("#send() called")
            console.log(response)
            return new Promise(function (resolve, reject) {
                var fbId = store.getSession(request.sessionId).fbid
                fbMessage(fbId, response.text)
                resolve()
            })
        },
        getMajors: function (request) {
            return new Promise(function (resolve, reject) {
                var entities = request.entities
                var context = request.context
                console.log("#getMajors() entered")
                console.log(entities)
                if (entities.location && entities.intent[0].university) {
                    models.University.find({
                        city: entities.location[0].value
                    }).populate("majors")
                        .sort({rating: "desc"})
                        .execute(function (err, uni) {
                            if (err) reject(err.message)
                            else if (!uni) reject("No universities found")
                            else {
                                new Promise(function (res, rej) {
                                    var currUni = 0
                                    while (!uni[currUni].majors) {
                                        currUni++;
                                        if (currUni >= uni.length) {
                                            rej("No majors found!")
                                            break
                                        }
                                    }
                                    if (currUni < uni.length) {
                                        res(uni[currUni])
                                    }
                                }).then(function (uni) {
                                    for (var i = 0; i < uni.majors.length; i++) {
                                        context["major" + i] = process.env.BASE_URL + "/major/" + uni.majors[i]._id
                                    }
                                    context.university = uni.name
                                    resolve(context)
                                }, function (err) {
                                    reject(err)
                                })
                            }
                        })
                } else if (entities.intent.majors && entities.university) {
                    models.University.findOne({
                        name: entities.university[0].value
                    })
                        .populate("majors")
                        .execute(function (err, uni) {
                            if (err) reject(err.message)
                            else if (!uni) reject("University not found")
                            else {
                                context.university = uni.name
                                for (var i = 0; i < uni.majors.length; i++) {
                                    context["major" + i] = process.env.BASE_URL + "/major/" + uni.majors[i]._id
                                }
                                resolve(context)
                            }
                        })
                } else {
                    console.log("#getMajors() desired entities not found")
                    reject("Error")
                }
            })
        },
        getMajor: function (request) {
            console.log("#getMajor() called")
            return new Promise(function (resolve, reject) {
                var context = request.context
                var entities = request.entities
                console.log(request.entities)
                if (entities.intent) {
                    //popular major in hk
                } else if (entities.major) {
                    context.major = entities.major[0].value
                    console.log(context.major)
                    models.Major.findOne({
                        name: context.major
                    }, function (err, major) {
                        if (err) reject(err.message)
                        if (!major) reject("Major not found")
                        else {
                            context.majorUrl = process.env.BASE_URL + "/major/" + major._id
                            resolve(context)
                        }
                    })
                } else {
                    console.log("#getMajor() desired entities not found")
                    reject("Error")
                }
            })
        },
        getApplicationDeadline: function (request) {
            console.log("#getApplicationDeadline called")
            return new Promise(function (resolve, reject) {
                var entities = request.entities
                var context = request.context
                if (entities.university) {
                    var universityName = entities.university[0].value
                    models.University.findOne({name: universityName}, function (err, uni) {
                        if (err) reject(err.message)
                        else if (!uni) reject("University not found")
                        else {
                            context.application_deadline = uni.applicationDeadline
                            resolve(context)
                        }
                    })
                } else {
                    console.log("#getMajor() desired entities not found")
                    reject("Error")
                }
            })
        },
        getUniversity: function (request) {
            console.log("#getUniversity() called")
            return new Promise(function (resolve, reject) {
                let {entities, context} = request
                console.log(entities)
                if (entities.location || entities.major) {
                    console.log(major)
                    models.Major.find({
                        name: entities.major[0].value
                    }, function (err, major) {
                        if (err) reject(err)
                        else if (!major) reject("Major not found")
                        else {
                            models.University
                                .findOne({
                                    majors: {
                                        $elemMatch: {
                                            $eq: major._id
                                        }
                                    },
                                    city: entities.location[0].value
                                })
                                .populate("majors")
                                .exec(function (err, uni) {
                                    if (err) reject(err.message)
                                    else if (!uni) reject("University not found")
                                    else {
                                        context.university = uni.name
                                        context.universityUrl = process.env.BASE_URL + "/university/" + uni._id
                                        resolve(context)
                                    }
                                })
                        }
                    })
                } else {
                    console.log("#getUniversity() desired entities not found")
                    reject("Error")
                }
            })
        },
        getIndustry: function (request) {
            console.log("Entered #getIndustry()")
            return new Promise(function (resolve, reject) {
                var {entities, context} = request
                console.log(entities)
                if (entities.industry) {
                    models.Industry.findOne({
                        name: entities.industry[0].value
                    }, function (err, industry) {
                        if (err) reject(err.message)
                        else if (!industry) reject("Industry not found")
                        else {
                            context.industryUrl = industry.websiteUrl
                            context.industry = industry.name
                            resolve(context)
                        }
                    })
                } else if (entities.intent[0].value == 'industry' && entities.major) {
                    models.Major.findOne({
                        name: entities.major[0].value
                    }, function (err, major) {
                        if (err) reject(err.message)
                        else if (!major) reject("Major not found")
                        else {
                            models.Industry.findOne({
                                majors: {
                                    $elemMatch: {
                                        $eq: major._id
                                    }
                                }
                            }, function (err, industry) {
                                if (err) reject(err.message)
                                else if (!industry) reject("Industry not found")
                                else {
                                    context.industry = industry.name
                                    context.industryUrl = industry.websiteUrl
                                    context.major = major.name
                                    resolve(context)
                                }
                            })
                        }
                    })
                } else {
                    console.log("#getIndustry() entities not found")
                    reject("Error")
                }
            })
        }
    }

    return new Wit({
        accessToken: process.env.AI_ACCESS_TOKEN,
        actions: actions
    })
}


module.exports = witWrapper
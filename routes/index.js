const express = require("express");
const passport    = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;
const models = require("../models/index");
const router = express.Router();

const users = {
  'bernie': 'password'
};


passport.use(new BasicStrategy(
  function(username, password, done) {
      const userPassword = users[username];
      if (!userPassword) { return done(null, false); }
      if (userPassword !== password) { return done(null, false); }
      return done(null, username);
  }
));

router.get("/", passport.authenticate('basic', {session: false}), function(req, res) {
  res.send("This is where I would store my API documentation");
});

//** get list of activities to track **//
router.get("/activities", passport.authenticate('basic', {session: false}), function(req, res) {
  models.Activity.findAll({})
  .then(function(data) {
    if(data) {
      activities = {"status": "success", activities: data};
      res.setHeader("Content-Type", "application/json");
      res.status(200).json(activities);
    } else{
      res.send("No activities found.");
    }
  })
  .catch(function(err) {
    err = {"status": "fail", error: err};
    res.status(500).send(err);
  })
});

//** create new activity to track **//
router.post("/activities", passport.authenticate('basic', {session: false}), function(req, res) {
  models.Activity.create({
    description: req.body.description,
    measure: req.body.measure,
  })
  .then(function(data) {
    data = {"status": "success", data: data};
    res.setHeader("Content-Type", "application/json");
    res.status(201).json(data);
  })
  .catch(function(err) {
    err = {"status": "fail", error: err};
    res.status(500).send(err);
  })
});

//** add stats for an activity **//
router.post("/activities/:id/stats", passport.authenticate('basic', {session: false}), function(req, res) {
  models.Activity.findOne({
    where: {id: req.params.id}
  })
  .then(function(activity) {
    models.Stat.create({
      date: req.body.date,
      activId: activity.id,
      units: req.body.units,
    })
    .then(function(data) {
      data = {"status": "success", data: data};
      res.setHeader("Content-Type", "application/json");
      res.status(201).json(data);
    })
    .catch(function(err) {
      err = {"status": "fail", error: err};
      res.status(500).send(err);
    })
  })
  .catch(function(err) {
    err = {"status": "fail", error: err};
    res.status(500).send(err);
  })
});

//** show info for one activity with associated stats **//
router.get("/activities/:id", passport.authenticate('basic', {session: false}), function(req, res) {
  models.Activity.findOne({
    where: {id: req.params.id},
    include: [
      {model: models.Stat, as: 'Stats'}
    ]
  })
  .then(function(data) {
    data = {"status": "success", data: data};
    res.setHeader("Content-Type", "application/json");
    res.status(200).json(data);
  })
  .catch(function(err) {
    err = {"status": "fail", error: err};
    res.status(500).send(err);
  })
});

//** update activity details but NOT stats associated **//
router.put("/activities/:id", passport.authenticate('basic', {session: false}), function(req, res) {
  models.Activity.update({
    description: req.body.description,
    measure: req.body.measure}, {
      where: {id: req.params.id}
    })
    .then(function(data) {
      data = {"status": "success", data: data};
      res.setHeader("Content-Type", "application/json");
      res.status(201).json(data);
    })
    .catch(function(err) {
      err = {"status": "fail", error: err};
      res.status(500).send(err);
    })
  });

//** delete activity and all associated stats **//
router.delete("/activities/:id", passport.authenticate('basic', {session: false}), function(req, res) {
  models.Stat.destroy({
    where: {activId: req.params.id}
  })
  .then(function(data) {
    models.Activity.destroy({
      where: {id: req.params.id}
    })
    .then(function(data) {
      data = {"status": "success", data: data};
      res.setHeader("Content-Type", "application/json");
      res.status(201).json(data);
    })
    .catch(function(err) {
      err = {"status": "fail", error: err};
      res.status(500).send(err);
    })
  })
  .catch(function(err) {
    err = {"status": "fail", error: err};
    res.status(500).send(err);
  })
});

//** remove tracked data for a day **//
router.delete("/stats/:id", passport.authenticate('basic', {session: false}), function(req, res) {
  models.Stat.destroy(
    {where: {id: req.params.id}}
  )
  .then(function(data) {
    data = {"status": "success", data: data};
    res.setHeader("Content-Type", "application/json");
    res.status(201).json(data);
  })
  .catch(function(err) {
    err = {"status": "fail", error: err};
    res.status(500).send(err);
  })
});


module.exports = router;

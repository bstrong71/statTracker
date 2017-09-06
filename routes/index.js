const express = require("express");
const passport    = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;
const models = require("../models/index");
const router = express.Router();

const users = {
  'bernie': 'password'
};

// router.get('/api/auth', passport.authenticate('basic', {session: false}),
//     function (req, res) {
//         res.json({"auth": req.user})
//     }
// );

passport.use(new BasicStrategy(
  function(username, password, done) {
      const userPassword = users[username];
      if (!userPassword) { return done(null, false); }
      if (userPassword !== password) { return done(null, false); }
      return done(null, username);
  }
));

router.get("/", passport.authenticate('basic', {session: false}), function(req, res) {
  res.redirect("/api");
});

router.get("/api", passport.authenticate('basic', {session: false}), function(req, res) {
  res.send("This is where I would have my API documentation.");
});

//** get list of activities to track **//
router.get("/api/activities", passport.authenticate('basic', {session: false}), function(req, res) {
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
//
// //purchase an item
// router.post("/api/customer/items/:itemId/purchases", function(req, res) {
//   models.Item.findOne({
//     where: {id: req.params.itemId}
//   })
//   .then(function(item) {
//     if(req.body.amtPaid < item.cost) {
//       err = {"status": "fail", error: {"amount paid": req.body.amtPaid, "amount required": item.cost}};
//       res.status(400).send(err);
//     } else if(item.qty < 1) {
//         err = {"status": "fail", error: "This item is out of stock."}
//         res.status(400).send(err);
//       } else {
//         let overpaid = req.body.amtPaid - item.cost;
//         models.Item.update({qty: item.qty - 1}, {
//           where: {id: req.params.itemId}
//         })
//         .then(function(data) {
//           models.Purchase.create({
//             itemId: item.id,
//             amtPaid: req.body.amtPaid,
//             change: overpaid
//           })
//           .then(function(data) {
//             data = {"status": "success", data: data};
//             res.setHeader("Content-Type", "application/json");
//             res.status(201).json(data);
//           })
//           .catch(function(err) {
//             err = {"status": "fail", error: err};
//             res.status(500).send(err);
//           })
//         })
//       }
//     })
//     .catch(function(err) {
//       err = {"status": "fail", error: err};
//       res.status(500).send(err);
//   })
// });
//
// //get a list of all purchases with their item and date/time
// router.get("/api/vendor/purchases", function(req, res) {
//   models.Purchase.findAll({
//     include: [
//       {model: models.Item, as: "Items"}
//     ]
//   })
//   .then(function(purchases) {
//     if(purchases) {
//       purchases = {"status": "success", purchases: purchases};
//       res.setHeader("Content-Type", "application/json");
//       res.status(200).json(purchases);
//     } else{
//       res.send("No purchases found.");
//     }
//   })
//   .catch(function(err) {
//     err = {"status": "fail", error: err};
//     res.status(500).send(err);
//   })
// });
//
// //get a total amount of money accepted by the machine
// router.get("/api/vendor/money", function(req, res) {
//   models.Purchase.sum("amtPaid")
//   .then(function(paid){
//     models.Purchase.sum("change")
//     .then(function(extra) {
//       let total = paid - extra;
//       data = {"status": "success", data: {total}};
//       res.setHeader("Content-Type", "application/json");
//       res.status(200).json(data);
//     })
//     .catch(function(err) {
//       err = {"status": "fail", error: err};
//       res.status(500).send(err);
//     })
//   })
//   .catch(function(err) {
//     err = {"status": "fail", error: err};
//     res.status(500).send(err);
//   })
// });
//
//add a new activity to be tracked
router.post("/api/activities", passport.authenticate('basic', {session: false}), function(req, res) {
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
//
// //update item quantity, description, and cost
// router.put("/api/vendor/items/:itemId", function(req, res) {
//   models.Item.update({
//     description: req.body.description,
//     cost: req.body.cost,
//     qty: req.body.qty}, {
//       where: {id: req.params.itemId}
//     })
//     .then(function(data) {
//       data = {"status": "success", data: data};
//       res.setHeader("Content-Type", "application/json");
//       res.status(201).json(data);
//     })
//     .catch(function(err) {
//       err = {"status": "fail", error: err};
//       res.status(500).send(err);
//     })
// });


module.exports = router;

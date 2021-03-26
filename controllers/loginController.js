const express = require('express')
var router = express.Router()
var ObjectId = require('mongoose').Types.ObjectId
var { User } = require('../models/user.model.js')

//localhost:4000/users/
// router.get('/user/:ID', (req, res2) => {
//     User.find((err, docs) => {
//         if (!err) { res2.send(docs); } else {
//             console.log('error in controller')
//         }
//     });
// });

router.get('/user/:userID', (req, res) => {
  let userID = req.params.userID.toUpperCase()
  User.findOne(
    { userID: userID },
    {
      userRole: 1,
      _id: 0,
      password: 1,
      collegeName: 1,
      registerNr: 1,
      userID: 1,
    }
  ).then((eachOne) => {
    if (eachOne) {
      res.json(eachOne)
    } else {
      User.findOne(
        { registerNr: parseInt(userID) },
        { userRole: 1, _id: 0, password: 1, collegeName: 1, userID: 1 }
      ).then((element) => {
        res.json(element)
      })
    }
  })
  // User.find({}, { userID: req.params.id }).then((eachOne) => {
  //     res.json(eachOne)
  // })
})

router.post('/adduser', (req, res) => {
  var prdt = new User({
    userID: req.body.userID,
    userRole: req.body.userRole,
    password: req.body.password,
    collegeCode: req.body.collegeCode,
    collegeName: req.body.collegeName,
    registerNr: req.body.registerNr,
  })
  prdt.save((err, docs) => {
    if (!err) {
      res.send(docs)
    } else {
      console.log('error in controller')
    }
  })
})

// router.put('/:id', (req, res) => {
//     console.log(req.params)
//     if (!ObjectId.isValid(req.params.id)) {
//         return res.status(400).send('No record with id');
//     }
//     var prdt = {
//         availableNetwork: req.body.availableNetwork,
//         productId: req.body.productId,
//         vendorName: req.body.vendorName,
//         connectsTo: req.body.connectsTo,
//         parameter: req.body.parameter,
//         name: req.body.name,
//     };
//     var id = req.params.id;
//     Product.findByIdAndUpdate(id, { $set: prdt }, { new: true }, (err, doc) => {
//         if (!err) {
//             res.send(doc);
//         } else {
//             console.log('Error in user', err)
//         }
//     })
// });

// router.delete('/:id', (req, res) => {
//     if (!ObjectId.isValid(req.params.id)) {
//         return res.status(400).send('No record with id');
//     }
//     Product.findByIdAndRemove(req.params.id, (err, doc) => {
//         if (!err) {
//             res.send(doc);
//         } else {
//             console.log('Error in employee')
//         }
//     })
// });
module.exports = router

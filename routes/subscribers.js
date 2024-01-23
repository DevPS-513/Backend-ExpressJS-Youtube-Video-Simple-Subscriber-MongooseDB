const Subscriber = require("../models/subscriber");
const express = require("express");
const router = express.Router();
const myfunctions = require("../myfunctions");

// Routes needed
// get all
// get one
// creating one, or POST
// Updating one, or PATCH
// Deleting one, or delete/all

// API help
router.get("/help", async (req, res) => {
  try {
    let SampleGen = new myfunctions.SampleGenerator(Subscriber.schema);
    SampleGen.generate();
    const subscriber_template = SampleGen.sampleJson;
    const subscriber_example = SampleGen.sampleEntry;

    res.status(200).json({
      message:
        " GET/POST/DELETE and PATCH are available for the subscriber model, the subscriber model looks like :",
      model: subscriber_template,
      model_example: subscriber_example,
      available_routes: {
        GET_1: "/get  (get all entries)",
        GET_2: "/getbyproperty/:property/:value  (get by property:value)",
        POST_1: "/  (Add an entry)",
        PATCH_1: "/:email  (Patch by unique e-mail)",
        DELETE_1: "/:email  (Delete by unique e-mail)",
        DELETE_2: "/delete/all (Delete all database entries)",
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/", async (req, res) => {
  let server_error = Error();
  try {
    const subscribers = await Subscriber.find();
    res.status(200).send(subscribers);
  } catch (err) {
    server_error = err;
    res.status(500).send({ message: server_error.message });
  }
});


router.get("/:email", async (req, res) => {
  try {
    let subscriber = await Subscriber.findOne({
      email: req.params["email"],
    });

    subscriber = await subscriber.save();

    res.status(200).send({
      message: " subscriber found successfully",
      found_subscriber: subscriber,
    });
  } catch (err) {
    req.status(500).send({ message: err.message });
  }
});

router.post("/", async (req, res) => {
  let newsubscriber = new Subscriber();

  try {
    for (let fieldname in req.body) {
      newsubscriber[fieldname] = req.body[fieldname];
    }

    newsubscriber = await newsubscriber.save();

    res.status(200).send({
      message: " new subscriber added succesfully",
      subscriber_added: newsubscriber,
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

router.patch("/", async (req, res) => {
  try {
    let updatedsubscriber = await Subscriber.findOne({
      email: req.body["email"],
    });

    for (let fieldname in req.body) {
      updatedsubscriber[fieldname] = req.body[fieldname];
    }

    updatedsubscriber = await updatedsubscriber.save();

    res.status(200).send({
      message: " subscriber updated successfully",
      updated_subscriber: updatedsubscriber,
    });
  } catch (err) {
    req.status(500).send({ message: err.message });
  }
});

router.delete("/", async (req, res) => {
  try {
    let updatedsubscriber = await Subscriber.findOneAndDelete({
      email: req.body["email"],
    });

    res.status(200).send({
      message: " subscriber deleted successfully",
      updated_subscriber: updatedsubscriber,
    });
  } catch (err) {
    req.status(500).send({ message: err.message });
  }
});

router.delete("/delete/all", async (req, res) => {
  try {
    await Subscriber.deleteMany({});

    Subscriber.collection.drop(function (err, result) {
      if (err) {
        console.log("Error dropping collection", err.message);
      }
    });

    res.json({ message: "All Subscribers deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

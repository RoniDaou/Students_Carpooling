const router = require("express").Router();
const auth = require("../middlewares/requireAuth");
const controller = require("../controllers/rideController");

router.use(auth);

router.get("/", controller.getRides);
router.get("/mine", controller.getDriverRides);
router.get("/requests/mine", controller.getMyRequests);
router.get("/requests/driver", controller.getDriverRequests);
router.get("/:rideId/requests", controller.getRideRequests);
router.get("/:rideId", controller.getSpecificRide);

router.post("/", controller.addRide);
router.post("/request", controller.requestRide);
router.post("/sos", controller.triggerSOS);

router.patch("/request/respond", controller.respondToRequest);
router.patch("/:rideId/punch-in", controller.punchInRide);
router.patch("/:rideId/punch-out", controller.punchOutRide);

router.delete("/:rideId", controller.deleteRide);

module.exports = router;

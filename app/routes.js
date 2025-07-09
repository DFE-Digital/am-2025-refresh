const express = require('express');
const router = express.Router();


const appsController = require('./controllers/appsController.js');

router.get("/app/how-many-people/:number", appsController.g_howmanypeople);
router.post("/app/how-many-people", appsController.p_howmanypeople);


module.exports = router;
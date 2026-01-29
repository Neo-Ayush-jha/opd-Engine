const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors()); 
app.use(express.json());

app.use("/api/doctors", require("./routes/doctorRoutes"));
app.use("/api/slots", require("./routes/slotRoutes"));
app.use("/api/tokens", require("./routes/tokenRoutes"));

module.exports = app;
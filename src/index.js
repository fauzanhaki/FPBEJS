const express = require("express"),
  { PORT } = require("./config"),
  bodyParser = require("body-parser"),
  router = require("./routes"),
  app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());

app.use(router);

app.get("/", (req, res) => {
  res.send("Ok");
});

app.listen(PORT, () => {
  console.log(`Server is up and listening at port: ${PORT}`);
});

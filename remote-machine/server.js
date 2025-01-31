const express = require("express");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/runtests", require("./routes/api/testAPI"));

const PORT = 80;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

module.exports = app;

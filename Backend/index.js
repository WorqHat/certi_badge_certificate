const express = require("express");
const cors = require("cors");
const invitation = require("./routes/send-email");

const app = express();

// Use CORS middleware first to enable cross-origin resource sharing
app.use(
  cors({
    origin: "http://localhost:5173", // Replace with your frontend's origin
    methods: ["POST", "GET"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Parse incoming request bodies as JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Define routes after middleware
app.use("/api/invitation", invitation);

// Handle CORS preflight requests
app.options("*", cors());

app.get("/", (req, res) => {
  console.log("Hello");
  res.send({
    query: req.query,
    params: req.params,
    headers: req.headers,
    body: req.body,
  });
});

app.listen(process.env.PORT || 3001, () => {
  console.log("Server is running on port 3001");
});

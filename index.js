const express = require("express");
const mongoose = require("mongoose");
const redis = require("redis");
const cors =require("cors")
const session = require("express-session");
const PostRouter = require("./routes/postRoutes");
const authRouter = require("./routes/authRouter");
var bodyParser = require("body-parser");
const {
  MONGO_USER,
  MONGO_PASSWORD,
  MONGO_IP,
  MONGO_PORT,
  SESSION_SECRET,
  REDIS_URL,
  REDIS_PORT,
} = require("./config");
let RedisStore = require("connect-redis")(session);
let redisClient = redis.createClient(
{
  host:REDIS_URL,
  port:REDIS_PORT
}

);

const app = express();
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
const port = process.env.PORT || 3000;
const MONGO_URL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`;

const connectwithRetry = () => {
  mongoose
    .connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("connected to db");
    })
    .catch((err) => {
      console.log(err);

      setTimeout(connectwithRetry, 5000);
    });
};
connectwithRetry();

app.enable("trust proxy")

app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: SESSION_SECRET,
    cookie: {
      secure: false,
      resave: false,
      saveUninitialized: false,
      httpOnly:true,
      maxAge:30000
    },
  })
);

app.get("/api", (req, res) => {
  res.send("<h2>Welcome to voxelkraftz api </h2>");
  console.log("yeah it ran")
});

app.use("/api/v1/posts", PostRouter);
app.use("/api/v1/auth", authRouter);

app.listen(port, () => console.log(`listening on port ${port}`));

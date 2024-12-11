import express from "express";
import dotenv from "dotenv";
import dbConnection from "./database/db.js";
import session from "express-session";
import ConnectMongoDBSession from "connect-mongodb-session";
import authRouter from "./routes/authRoutes.js";

dotenv.config();
const port = process.env.PORT;
const mongoDbStore = ConnectMongoDBSession(session);
//session store
const store = mongoDbStore({
  uri: process.env.MONGO_DB_URI,
  collection: "sessions",
});
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET_ID,
    resave: false, //unsave unchanged sessions
    saveUninitialized: false, //unsave initialized sessions
    store: store,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    },
  })
);
app.use("/api/auth", authRouter);

//error middlewares
app.use((req, res, next) => {
  const error = new Error(`path not found!${req.originalUrl}`);
  res.status(404);
  next(error);
});
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({ success: false, error: err.message });
});
app.listen(port, () => {
  console.log(`Server is running at port:${port}`);
});

dbConnection();

const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
// const { verify } = require("jsonwebtoken");
// const jwt = require("jsonwebtoken");
require("colors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// midddle Ware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.chgrg5k.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

// function VerifyjsonWebToken(req, res, next) {
//   const authHeader = req.headers.authorization;
//   if (!authHeader) {
//     return res.status(401).send({ message: "Unauthorized Access" });
//   }
//   const token = authHeader.split(" ")[1];
//   jwt.verify(token, process.env.JWT_ACCESS_TOKEN, function (err, decoded) {
//     if (err) {
//       return res.status(401).send({ message: "Unauthorized access" });
//     }
//     req.decoded = decoded;
//     next();
//   });
// }

async function run() {
  try {
    client.connect();
    console.log("Database Connected");
  } catch (error) {
    console.log(error.name, error.message);
  }
}

run().catch((err) => console.log(err.message));

const doctorPortal = client.db("doctorPortalDbUser").collection("services");
const ClientRiviews = client.db("doctorPortalDbUser").collection("riviews");

// app.post("/jwt", (req, res) => {
//   try {
//     const user = req.body;
//     const token = jwt.sign(user, process.env.JWT_ACCESS_TOKEN, {
//       expiresIn: "365d",
//     });
//     res.send({ token });
//   } catch (error) {
//     console.log(error.name, error.message);
//   }
// });

try {
  app.get("/services", async (req, res) => {
    const query = {};
    const cursor = doctorPortal.find(query);
    const services = await cursor.limit(3).toArray();
    res.send(services);
  });
} catch {
  console.log(err.name, err.stack);
}

try {
  app.get("/allservices", async (req, res) => {
    const query = {};
    const cursor = doctorPortal.find(query).sort({ _id: -1 });
    const services = await cursor.toArray();
    res.send(services);
  });
} catch {
  console.log(err.name, err.stack);
}

app.post("/allservices", async (req, res) => {
  const query = req.body;
  const service = doctorPortal.insertOne(query);
  res.send(service);
});

// get single service details

try {
  app.get("/allservices/:id", async (req, res) => {
    const id = req.params.id;
    const query = { _id: ObjectId(id) };
    const result = await doctorPortal.findOne(query);
    res.send(result);
  });
} catch (error) {}

app.post("/riviews", async (req, res) => {
  try {
    const riviews = req.body;
    const result = await ClientRiviews.insertOne(riviews);
    res.send(result);
  } catch (error) {
    res.send({
      success: false,
      message: "cannot feedback",
    });
  }
});

app.get("/riviews", async (req, res) => {
  try {
    // const decoded = req.decoded;
    // // console.log(decoded);
    // if (decoded.email !== req.query.email) {
    //   res.status(403).send("unauthorized access");
    // }
    let query = {};
    if (req.query.email) {
      query = {
        email: req.query.email,
      };
    }
    const cursor = ClientRiviews.find(query);
    const result = await cursor.toArray();
    res.send(result);
  } catch (error) {}
});

app.get("/riviews/:id", async (req, res) => {
  const id = req.params.id;
  const query = { sericeID: id };
  const cursor = ClientRiviews.find(query);
  const result = await cursor.toArray();
  res.send(result);
});

app.patch("/riviews/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const query = { _id: ObjectId(id) };
    const updatedDoc = {
      $set: req.body,
    };
    const result = await ClientRiviews.updateOne(query, updatedDoc);
    console.log(result);
    return res.send(result);
  } catch (error) {
    console.log(error.name, error.message);
  }
});

app.delete("/riviews/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const query = { _id: ObjectId(id) };
    const riview = await ClientRiviews.deleteOne(query);
    res.send(riview);
  } catch (error) {
    console.log(error.name);
  }
});

app.get("/", (req, res) => {
  res.send("Hello im from backend");
});
app.listen(port, () => {
  console.log(`Doctor portal server running ong ${port}`);
});

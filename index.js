const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
require("colors");
const app = express();
const port = process.env.PORT || 5000;

// midddle Ware
app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://doctorPortalDbUser:orqY8jCH3NXCdWxO@cluster0.chgrg5k.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
// client.connect((err) => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });

async function run() {
  try {
    client.connect();
    console.log("Database Connected");
  } catch (error) {
    console.log(error.name.bgRed, error.message.bold);
  }
}

run().catch((err) => console.log(err.message.bgRed));

const doctorPortal = client.db("doctorPortalDbUser").collection("services");
const ClientRiviews = client.db("doctorPortalDbUser").collection("riviews");

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
    const cursor = doctorPortal.find(query);
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
    res.send(result);
  } catch (error) {}
});

app.delete("/riviews/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const query = { _id: ObjectId(id) };
    const riview = await ClientRiviews.deleteOne(query);
    res.send(riview);
  } catch (error) {
    console.log(error.name.bgRed);
  }
});

app.get("/", (req, res) => {
  res.send("Hello im from backend");
});
app.listen(port, () => {
  console.log(`Doctor portal server running ong ${port}`.bgGreen);
});

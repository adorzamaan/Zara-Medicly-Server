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

// get single service details

try {
  app.get("/allservices/:id", async (req, res) => {
    const id = req.params.id;
    const query = { _id: ObjectId(id) };
    const result = await doctorPortal.findOne(query);
    res.send(result);
  });
} catch (error) {}

app.get("/", (req, res) => {
  res.send("Hello im from backend");
});
app.listen(port, () => {
  console.log(`Doctor portal server running ong ${port}`.bgGreen);
});

const express = require("express");
const { MongoClient } = require("mongodb");

const app = express();
const port = 3000;

const url = "mongodb://127.0.0.1:27017";
const dbName = "shopdb";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

async function createDocument(req, res) {
  const client = new MongoClient(url);
  try {
    await client.connect();
    console.log("Connected to the database");

    const db = client.db(dbName);
    const collection = db.collection("customers");

    const { cid, name, phone, address, email } = req.body;

    const newCustomer = {
      cid: cid,
      name: name,
      phone: phone,
      address: address,
      email: email,
    };

    const result = await collection.insertOne(newCustomer);
    console.log("Created document:", result.insertedId);

    res.send(result.insertedId);
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await client.close();
    console.log("Disconnected from the database");
  }
}

async function updateDocument(req, res) {
  const client = new MongoClient(url);
  try {
    await client.connect();
    console.log("Connected to the database");

    const db = client.db(dbName);
    const collection = db.collection("customers");

    const cid = req.body.cid;
    const phone = req.body.phone;

    const filter = { cid: cid };
    const update = { $set: { phone: phone } };

    const result = await collection.updateOne(filter, update);
    console.log("Updated document:", result.modifiedCount);

    if (result.modifiedCount === 1) {
      res.send("Document has been updated");
    } else {
      res.send("No document found for the provided CID");
    }
  } catch (err) {
    console.error("Error:", err);
    res.send("An error occurred during the update operation");
  } finally {
    await client.close();
    console.log("Disconnected from the database");
  }
}

async function deleteDocument(req, res) {
  const client = new MongoClient(url);
  try {
    await client.connect();
    console.log("Connected to the database");

    const db = client.db(dbName);
    const collection = db.collection("customers");

    const cid = req.body.cid;

    const filter = { cid: cid };

    const result = await collection.deleteOne(filter);
    console.log(result);
    res.send("Record deleted");
    console.log("Deleted document:", result.deletedCount);
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await client.close();
    console.log("Disconnected from the database");
  }
}

async function readDocument(res) {
  const client = new MongoClient(url);
  try {
    await client.connect();
    console.log("Connected to the database");

    const db = client.db(dbName);
    const collection = db.collection("customers");

    const result = await collection.find().toArray();

    res.json(result);
    console.log("Retrieved documents");
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await client.close();
    console.log("Disconnected from the database");
  }
}

app.get("/", (req, res) => {
  res.send("Hello");
});

app.post("/create", (req, res) => {
  createDocument(req, res);
});

app.get("/read", (req, res) => {
  readDocument(res);
});

app.put("/update", (req, res) => {
  updateDocument(req, res);
});

app.delete("/delete", (req, res) => {
  deleteDocument(req, res);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

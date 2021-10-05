
const app = require("express")();
const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer, {
    cors: {
        origin: "http://localhost:3000"
    }
});

const { MongoClient } = require("mongodb");
const Db = process.env.ATLAS_URI;
const client = new MongoClient(Db, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
 
var _db;
 
module.exports = {
  connectToServer: function (callback) {
    client.connect(function (err, db) {
      // Verify we got a good "db" object
      if (db)
      {
        _db = db.db("myFirstDatabase");
        console.log("Successfully connected to MongoDB."); 

        io.on("connection", socket => {
            socket.on('connect', () => {
                console.log('new user connected');
            });

            socket.on('addRecord', () => {
                addRecord()
            });

            socket.on("disconnect", () => {
                console.log("user disconnected");
            });
        });

        function addRecord() {
            _db.collection.insert({
                calculation: 'test',
                timestamp: 'test'
            });
        }

        httpServer.listen(8081, () => console.log(`Listening on port 8081`));
      }
      return callback(err);
         });
  },
 
  getDb: function () {
    return _db;
  },
};
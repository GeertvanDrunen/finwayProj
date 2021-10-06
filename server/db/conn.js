
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
      if (db)
      {
        _db = db.db("calculations");
        console.log("Successfully connected to MongoDB."); 

        io.on("connection", socket => {
            socket.on('connect', () => {
                console.log('new user connected');
            });

            socket.on('addCalculation', (payload) => {
                addCalculation(payload)
            });

            socket.on('requestHistory', () => {
                fetchHistory(socket);
            });

            socket.on("disconnect", () => {
                console.log("user disconnected");
            });
        });

        function addCalculation(payload) {
            _db.collection('history').insertOne(payload);
        }

        function fetchHistory(socket) {
            _db.collection("history").find().sort({_id: -1}).limit(10).toArray(function (err, result) {
              if (err) throw err;
              socket.emit('deliverHistory', result);
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
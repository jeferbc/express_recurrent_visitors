const express = require('express');
const app = express();
const mongoose = require("mongoose");

mongoose.connect('mongodb://localhost:27017/test' ,{ useNewUrlParser: true });
mongoose.connection.on("error", function(e){ console.error(e); });
app.use(express.urlencoded());
app.set('view engine', 'pug');
app.set('views', 'views');

// definimos el schema
var schema = mongoose.Schema({ count: Number ,name: String });
// definimos el modelo
var RecurrentVisitor = mongoose.model("RecurrentVisitor", schema);

app.get('/', (req, res) => {
  let name = req.query.name || 'Anónimo'
  console.log(name)
  RecurrentVisitor.findOne({ name: name }, function(err, visitor) {
    if (err) return console.error(err);
    if (visitor){
      console.log(visitor)
      visitor.count += 1
    }else{
      var visitor = new RecurrentVisitor({ name: name, count: 1 })
      console.log(visitor)
    }visitor.save(function(err) {
      if (err) return console.error(err);
      RecurrentVisitor.find(function(err, visitors) {
        if (err) return console.error(err);
        res.render('visitors', { visitors: visitors })
      });
    });
  });
});

app.listen(3000, () => console.log('listening 3000'));

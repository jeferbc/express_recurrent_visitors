const express = require('express');
const app = express();
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost:27017/mongo-1', { useNewUrlParser: true });
mongoose.connection.on("error", function(e){ console.error(e); });
app.use(express.urlencoded());
app.set('view engine', 'pug');
app.set('views', 'views');

// definimos el schema
var schema = mongoose.Schema({ count: Number ,name: String });
// definimos el modelo
var RecurrentVisitor = mongoose.model("RecurrentVisitor", schema);
app.get('/', async (req, res) => {
  let visitor
  let name = req.query.name || 'Anónimo';
  if(name === 'Anónimo')
    visitor = new RecurrentVisitor({ name: name, count: 1 });
  else{
    visitor = await RecurrentVisitor.findOne({ name: name })
    if(visitor)
      visitor.count += 1;
    else
      visitor = new RecurrentVisitor({ name: name, count: 1 });
  }
  await visitor.save();
  const visitors = await RecurrentVisitor.find()
  res.render('visitors', { visitors: visitors })
});

app.listen(3000, () => console.log('listening 3000'));

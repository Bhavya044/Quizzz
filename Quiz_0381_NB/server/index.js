
    require('dotenv').config();




const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const userRoutes = require('./routes/users');
const quizRoutes = require('./routes/quizzes');
const path = require('path');;


const app = express();
const PORT = process.env.PORT || 9000;
let server;
app.use(cors());
  app.use(function (req, res, next) {
    //Enabling CORS
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization");
      next();
    });
app.use(bodyParser.urlencoded({ extended: true, limit: '20mb' }));
app.use(bodyParser.json({ limit: '20mb' }));

// middlware config


app.get('/', (req, res) => { 
res.send('server is running')
})
app.use('/api/users/', userRoutes);
app.use('/api/quizzes/', quizRoutes);
// `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pm4ek.gcp.mongodb.net/CommentsDB?retryWrites=true&w=majority`
mongoose.connect('mongodb+srv://bhavya:bhavya@cluster0.worhd.mongodb.net/QuizNbyula', {
        useUnifiedTopology: true,
        useNewUrlParser: true
    }).then(() => console.log('Database connected'))
    .catch(er => console.log('Error connecting to mongodb: ', er));


if (process.env.NODE_ENV == 'production') {
    app.use(express.static('client/build'));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
     }
    )



}
app.use(express.static(path.join(__dirname+"/public")))


server = app.listen(PORT, () => {
    console.log(`Node server up & running on port: ${PORT}`);
});

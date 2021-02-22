import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';

import config from "./config.js";

const app = express();

const middleware = [
    cors(),
    bodyParser.urlencoded({
        limit: '50mb',
        extended: true,
        parameterLimit: 50000
    }),
    bodyParser.json({
        limit: '50mb',
        extended: true
    })
]
middleware.forEach((it) => app.use(it))

const userSchema = new mongoose.Schema({
    "id": Number,
    "email": {
        type: String,
        require: true,
        unique: true
    },
    "password": {
        type: String,
        require: true
    },
    "role": {
        type: [String],
        default: ["user"]
    }
}, {
    versionKey: false
})

const userSchemaTours = new mongoose.Schema({
    "tourTitle": String,
    "tour": String
}, {
    versionKey: false
})

//connect to MongoDB
const url = config.url;
mongoose.connection.on('connected', () => {
    console.log('DB is connected')
});
mongoose.connection.on('error', (err) => {
    console.log(`cannot connect to db ${err}`)
    process.exit(1)
});
mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    app.listen(config.port, () => {
        console.log(`server is working http://localhost:${config.port}. Wait, project will be start http://localhost:3000`)
    });
})

//create collection DB
const User = mongoose.model('site1', userSchema, 'users');
export default User;

export const Tour = mongoose.model('tours', userSchemaTours);

//create REST API

app.get('/', function(req, res) {
    res.send('Hello Server');
});

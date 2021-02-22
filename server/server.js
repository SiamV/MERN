import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

import config from "./config.js";

const app = express();
const __dirname = path.resolve(); //for ES6

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

//work with tours
app.get("/api/v1/tours", async (req, res) => {
    const tours = await Tour.find({})
    res.send(tours)
})

app.post("/api/v1/add/tours", async (req, res) => {
    const tour = await new Tour({
        tourTitle: req.body.tourTitle,
        tour: req.body.tour
    })
    tour.save()
    res.send(tour)
})

app.delete("/api/v1/delete/tours/:id", async (req, res) => { //not use, need check
    try {
        await Tour.deleteOne({_id: req.params.id})
        res.status(204).send()
    } catch {
        res.status(404)
        res.send({error: "Tour doesn't exist!"})
    }
})

//API work with photos (formidable)
app.get('/api/v1/get/photo/:name', async (req, res) => {
    res.sendFile(path.join(__dirname, '../', '/client/public/uploaded/') + req.params.name);
});

app.get('/api/v1/get/src/image', async (req, res) => { //to get all files from folder
    let dir = path.join(__dirname, '../', '/client/public/uploaded/')
    let filesURL = await fs.readdirSync(dir).map((file) => dir + file);
    res.send(filesURL)
});

app.post('/api/v1/add/photo', async (req, res, next) => { //send file to folder in server
    const form = await formidable({multiples: true});

    form.parse(req, (err, fields, files) => {
        const oldPath = files.image.path;
        const newPath = path.join(__dirname, '../', '/client/public/uploaded/') + files.image.name
        const rawData = fs.readFileSync(oldPath)

        fs.writeFile(newPath, rawData, function (err) {
            if (err) console.log(err)
            return res.send("Photo is uploaded")
        })
        // console.log('fields:', fields);
        // console.log('files:', files);
    });
});

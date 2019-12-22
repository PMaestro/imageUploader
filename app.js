const express = require('express');
const multer = require('multer');
const ejs = require('ejs');
const path = require('path');
const uuidv4 = require('uuid/v4');
const PORT = process.env.PORT || 1337;

//get current date
function currentDate() {
    var newdate = new Date();
    let dateString =
        newdate.getUTCFullYear() + "/" +
        ("0" + (newdate.getUTCMonth() + 1)).slice(-2) + "/" +
        ("0" + newdate.getUTCDate()).slice(-2) + " " +
        ("0" + newdate.getUTCHours()).slice(-2) + ":" +
        ("0" + newdate.getUTCMinutes()).slice(-2) + ":" +
        ("0" + newdate.getUTCSeconds()).slice(-2);
    return dateString;
}


//set Storage engine
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function (req, file, cb) {
        cb(null, currentDate().toString().replace("\\","/") + file.fieldname + Date.now() + path.extname(file.originalname));
    }
});
//check filetype

function checkFileType(file, cb) {
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}

//initialize upload variable
const upload = multer({
    storage: storage,
    limits: { fieldSize: 10000000 },
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
}).single('myImage');



//init app
const app = express();

//EJS
app.set('view engine', 'ejs');

//public folder
app.use(express.static('./public'));


app.use('/upload', (req, res) => {
    console.log('Metodo chamado');
    upload(req, res, (err) => {
        if (err) {
            res.render('index', {
                msg: err
            });

        } else {
            if (req.file == undefined) {
                res.render('index', {
                    msg: 'Error no file selected'
                });
            } else {
                console.log(req.file);
                res.render('index', {
                    msg: 'File Uploaded!',
                    file: `uploads/${req.file.filename}`
                });
            }

        }
    })
});

app.use('/', (req, res) => res.render('index'));




app.listen(PORT);
const express = require('express');
const user_route = express();
const path = require('path');
const multer = require ('multer');
const puppeteer = require('puppeteer');

const bodyParser = require('body-parser');
const session = require('express-session');

const { SESSION_SECRET }= process.env;
user_route.use(session({secret:SESSION_SECRET}))

user_route.use(bodyParser.json());
user_route.use(bodyParser.urlencoded({extended:true}));
user_route.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));

user_route.set('view engine', 'ejs');
user_route.set('views', './views');
user_route.use(express.static('public'));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/images'));
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });


// Configure multer to handle different file types
const dokumentasi_storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/images')); // Change the destination path if needed for other types of files
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// File filter to accept images, Excel, PDF, and CSV files
const dokumentasi_upload = multer({ 
  storage: dokumentasi_storage,
  fileFilter: function (req, file, cb) {
    // Check for allowed file extensions
    const filetypes = /jpeg|jpg|png|gif|pdf|xlsx|xls|csv/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (extname) {
      return cb(null, true);
    } else {
      cb('Error: Only images, Excel files, PDFs, and CSV files are allowed!');
    }
  }
});

// Middleware for static files
user_route.use('/images', express.static('public/images'));



//upload image 
const approval_storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/images'));
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const approval_upload = multer({ storage: approval_storage });
// Middleware untuk static files
user_route.use('/images', express.static('public/images'));





const userController = require('../controllers/userController');
const pelangganController = require('../controllers/pelangganController');
const loketpelangganController = require('../controllers/loketPelangganController');
const poocPelangganController = require('../controllers/poocPelangganController');
const pesanController = require('../controllers/pesanController');
const blastController = require('../controllers/blastController');
const poocBlastController = require('../controllers/poocBlastController');
const loketblastController = require('../controllers/loketBlastController');
const plannerController = require('../controllers/plannerController');
const cspesanController = require('../controllers/cspesanController');


const poocpesanController = require('../controllers/poocpesanController');

const auth = require('../middlewares/auth');


function ensureAuthenticated(req, res, next) {
  // Bypass authentication for Puppeteer
  if (req.headers['x-puppeteer'] === 'true') {
      return next();
  }

  // Standard authentication logic
  if (req.isAuthenticated()) {
      return next();
  } else {
      res.redirect('/login');
  }
}

user_route.get('/landingpage', userController.landingLoad);

user_route.get('/register', auth.isLogout, userController.registerLoad );
user_route.post('/registerpos', auth.isLogin, userController.register );

user_route.get('/wait', (req, res)=>{ res.render('wait')})

user_route.get('/login', auth.isLogout, userController.loadLogin );
user_route.post('/login', userController.login );
user_route.get('/logout', auth.isLogin, userController.logout );

user_route.get('/em/dashboard', auth.isEM, auth.isLogin, userController.loadDashboardEM, ensureAuthenticated);
user_route.get('/em/pelanggan/get', auth.isEM, auth.isLogin, pelangganController.loadPelanggan, ensureAuthenticated);
user_route.get('/em/pelanggan/create', auth.isEM, auth.isLogin, pelangganController.loadCreate, ensureAuthenticated);
user_route.post('/create_pelanggan', auth.isEM, auth.isLogin, pelangganController.createPelanggan, ensureAuthenticated);
user_route.get('/api/jenis_transaksi', pelangganController.getTransactions, ensureAuthenticated);
user_route.get('/updatepelanggan/:id', auth.isEM, auth.isLogin, pelangganController.loadUpdatePelanggan, ensureAuthenticated );
user_route.post('/update_pelanggan/:id', auth.isEM, auth.isLogin, pelangganController.updatePelanggan, ensureAuthenticated);
user_route.get('/deletepelanggan/:id', auth.isEM, auth.isLogin, pelangganController.deletePelanggan, ensureAuthenticated);
user_route.get('/em/pelanggan/ujipetik', auth.isEM, auth.isLogin, pelangganController.loadUjipetik, ensureAuthenticated);
user_route.post('/update_ujipetik/:id', auth.isEM,  dokumentasi_upload.single('dokumentasi'), auth.isLogin, pelangganController.updateUjipetik, ensureAuthenticated);
user_route.get('/updateujipetik/:id', auth.isEM, auth.isLogin, pelangganController.loadUpdateUjipetik, ensureAuthenticated);

user_route.post('/createuser', auth.isEM, auth.isLogin, userController.postDataUser);
user_route.get('/em/data_user/get_user', auth.isEM, auth.isLogin, userController.loadDataUser);
user_route.get('/em/data_user/create_user', auth.isEM, auth.isLogin, userController.createDataUser);
user_route.get('/update_user/:id', auth.isEM, auth.isLogin, userController.updateDataUser);
user_route.post('/updateuser/:id', auth.isEM, auth.isLogin, userController.postUpdateDataUser);
user_route.get('/delete_user/:id', auth.isEM, auth.isLogin, userController.deleteDataUser);

user_route.get('/em/pesan/get_pesan', auth.isEM, auth.isLogin, pesanController.loadMessages );
user_route.get('/em/pesan/create_pesan', auth.isEM, auth.isLogin, pesanController.loadCreate);
user_route.post('/createpesan', auth.isEM,  upload.single('foto'), auth.isLogin, pesanController.createMessage);
user_route.get('/updatepesan/:id', auth.isEM, auth.isLogin, pesanController.loadUpdateMessages);
user_route.post('/update_pesan/:id', auth.isEM, auth.isLogin, pesanController.updateMessage);
user_route.get('/deletepesan/:id', auth.isEM, auth.isLogin, pesanController.deleteMessage);

user_route.get('/em/planner/get_planner', auth.isEM, auth.isLogin, plannerController.loadPlanner );
user_route.get('/em/planner/create_planner', auth.isEM, auth.isLogin, plannerController.loadCreatePlanner);
user_route.post('/createplanner', auth.isEM, auth.isLogin, plannerController.createPlanner);
user_route.get('/updateplanner/:id', auth.isEM, auth.isLogin, plannerController.loadUpdatePlanner);
user_route.post('/update_planner/:id', auth.isEM, auth.isLogin, plannerController.updatePlanner);
user_route.get('/deleteplanner/:id', auth.isEM, auth.isLogin, plannerController.deletePlanner);

user_route.get('/em/wablast/create_blast', auth.isEM, auth.isLogin, pesanController.renderBlastForm);
user_route.post('/createblast', auth.isEM, auth.isLogin, blastController.sendBlast);

user_route.get('/loket/dashboard', auth.isLoket, auth.isLogin, userController.loadDashboardLoket);
user_route.get('/loket/pelanggan/get', auth.isLoket, auth.isLogin, loketpelangganController.loadPelanggan);
user_route.get('/loket/pelanggan/create', auth.isLoket, auth.isLogin, loketpelangganController.loadCreate);
user_route.post('/create_pelanggan_loket', auth.isLoket, approval_upload.single('approval'), auth.isLogin,   loketpelangganController.createPelanggan);
user_route.get('/api/jenis_transaksi', pelangganController.getTransactions);
user_route.get('/updatepelangganloket/:id', auth.isLoket, auth.isLogin, loketpelangganController.loadUpdatePelanggan);
user_route.post('/update_pelangganloket/:id', auth.isLoket, auth.isLogin, approval_upload.single('approval'), loketpelangganController.updatePelanggan);
user_route.get('/deletepelangganloket/:id', auth.isLoket, auth.isLogin, loketpelangganController.deletePelanggan);

user_route.get('/pelanggan/wablast/create_blast', auth.isLoket, auth.isLogin, pesanController.renderBlastForm);
user_route.post('/createblast', auth.isLoket, auth.isLogin, loketblastController.sendBlast);

user_route.get('/pooc/dashboard', auth.isPooc, auth.isLogin, userController.loadDashboardPooc);
user_route.get('/pooc/pelanggan/get', auth.isPooc, auth.isLogin, poocPelangganController.loadPelanggan);
user_route.get('/pooc/pelanggan/create', auth.isPooc, auth.isLogin, poocPelangganController.loadCreate);
user_route.post('/create_pelanggan_pooc', auth.isPooc, auth.isLogin, poocPelangganController.createPelanggan);
user_route.get('/api/jenis_transaksi', pelangganController.getTransactions);
user_route.get('/updatepelangganpooc/:id', auth.isPooc, auth.isLogin, poocPelangganController.loadUpdatePelanggan);
user_route.post('/update_pelangganpooc/:id', auth.isPooc, auth.isLogin, poocPelangganController.updatePelanggan);
user_route.get('/deletepelangganpooc/:id', auth.isPooc, auth.isLogin, poocPelangganController.deletePelanggan);
user_route.get('/pooc/pelanggan/ujipetik', auth.isPooc, auth.isLogin, poocPelangganController.loadUjipetik);
user_route.post('/update_ujipetikpooc/:id', auth.isPooc,  dokumentasi_upload.single('dokumentasi'), auth.isLogin, poocPelangganController.updateUjipetik);
user_route.get('/updateujipetikpooc/:id', auth.isPooc, auth.isLogin, poocPelangganController.loadUpdateUjipetik);
user_route.get('/deleteujipetikpooc/:id', auth.isPooc, auth.isLogin, poocPelangganController.deletePelangganPooc);

user_route.get('/pooc/wablast/create_blast', auth.isPooc, auth.isLogin, poocpesanController.renderBlastForm);
user_route.post('/createblastpooc', auth.isPooc, auth.isLogin, poocBlastController.sendBlastPooc);

user_route.get('/cs/dashboard', auth.isCs, auth.isLogin, userController.loadDashboardCs);
user_route.get('/cs/pesan/get_pesan', auth.isCs, auth.isLogin, cspesanController.loadMessagesCS );
user_route.get('/cs/pesan/create_pesan', auth.isCs, auth.isLogin, cspesanController.loadCreateCs);
user_route.post('/createpesanCs', auth.isCs,  upload.single('foto'), auth.isLogin, cspesanController.createMessageCs);
user_route.get('/updatepesancs/:id', auth.isCs, auth.isLogin, cspesanController.loadUpdateMessagesCs);
user_route.post('/update_pesanCs/:id', auth.isCs, auth.isLogin, cspesanController.updateMessageCs);
user_route.get('/deletepesancs/:id', auth.isCs, auth.isLogin, cspesanController.deleteMessageCs);


user_route.get('/pdf', async (req, res) => {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        const url = `${req.protocol}://${req.get('host')}/em/pelanggan/get`;

        // Menambahkan header khusus untuk bypass authentication
        await page.setExtraHTTPHeaders({
            'x-puppeteer': 'true',
        });

        await page.goto(url, { waitUntil: 'networkidle2' });

        const pdfBuffer = await page.pdf({ format: 'A4' });

        await browser.close();

        res.contentType("application/pdf");
        res.send(pdfBuffer);
    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).send('Error generating PDF');
    }
});

user_route.get('*', function(req, res){
    res.redirect('/landingpage');
})



module.exports = user_route;



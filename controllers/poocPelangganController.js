const Info = require('../models/pelangganModel');
const multer = require('multer');
const path = require('path');

const loadPelanggan = async (req, res) =>{
  const id = req.params.id;
  try{
      var infos = await Info.find(id)
      const reversedPosts = infos.reverse();
      res.render('pooc/pelanggan/get', {user: req.session.user, infos:infos, infos: reversedPosts });
  }
  catch (error){
      console.log(error.message);
  }
}

// Kontroller untuk menyimpan data postingan ke MongoDB
const postInfo = async (req, res) => {
  try {
    const { judul, deskripsi } = req.body;
    const image = '/uploads/' + req.file.filename; // Jika ada file gambar

    const newPost = new Info({
      judul,
      deskripsi,
      image
    });

    await newPost.save();

    res.redirect('/mahasiswa/info/read-info');
  } catch (error) {
    console.error('Kesalahan:', error);
    res.status(500).send('Error saving to database: ' + error.message);
  }
}

const loadUpdatePelanggan = async (req, res) =>{
  const id = req.params.id;
  try{
      const infos = await Info.findById({ _id: id });
      res.render('pooc/pelanggan/update', {user: req.session.user, infos:infos });
  }

  catch (error){
      console.log(error.message);
  }
}

const updatePelanggan = async(req, res) => {
  const id = req.params.id;
  const {
      nama,
      tlp, 
      jenis_transaksi,
      jml,
      bsu,
      tgl_transaksi,
      alamat, 
      kecamatan, 
      rt,
      rw, 
      kelurahan, 
      kodepos, 
      kota, 
      provinsi
      } = req.body;
  Info.findByIdAndUpdate(id, {
    nama,
      tlp, 
      jenis_transaksi,
      jml,
      bsu, tgl_transaksi,
      alamat, kecamatan, 
      rt,
      rw, 
      kelurahan, 
      kodepos, 
      kota, 
      provinsi
   })
    .then(() => {
      res.redirect('/pooc/pelanggan/get');
    })
    .catch(err => console.log(err));
}

const deletePelanggan = async (req, res) => {
  const id = req.params.id;
  try {
    await Info.findByIdAndDelete(id);
    res.redirect('/pooc/pelanggan/get');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

const generateCustomId = async (jenis_transaksi) => {
  try {
    // Mapping of jenis_transaksi to shortened codes
    const jenisTransaksiMapping = {
      "weselpos instan": "wpi",
      "weselpos prima": "wpp",
      "cash to account": "cta",
      "weselpos korporat": "wpk",
      "weselpos luar negeri": "wpln",
      "wesel pos dalam negeri": "wpdn",
      "syariah": "syh",
      "pln": "pln",
      "telco": "tel",
      "pdam": "pdam",
      "pajak daerah": "pjd",
      "pajak nasional": "pjn",
      "pinjaman": "pjm",
      "BTN Penarikan": "btp",
      "BTN Penyetoran": "bts",
      "BTPN Penarikan": "btpn",
      "BTPN Penyetoran": "btps",
      "meterai": "mtr",
      "konsfila": "kfl",
       "bpjsnew": "bpjsn"
    };

    // Get the shortened code based on jenis_transaksi
    const shortCode = jenisTransaksiMapping[jenis_transaksi.toLowerCase()];

    if (!shortCode) {
      throw new Error('Invalid jenis_transaksi');
    }

    // Count the existing records with the same jenis_transaksi
    const count = await Info.countDocuments({ jenis_transaksi });

    // Increment the count to get the next sequence number
    const sequenceNumber = count + 1;

    // Generate the custom ID (e.g., wpln0001)
    const customId = `${shortCode}${String(sequenceNumber).padStart(4, '0')}`;

    return customId;
  } catch (error) {
    console.error('Error generating custom ID:', error);
    throw new Error('Failed to generate custom ID');
  }
};

const loadCreate = async (req, res) => {
  try {
    const infos = await Info.find({});
    res.render('pooc/pelanggan/create', {
      user: req.session.user,
      infos: infos
    });
  } catch (error) {
    console.error('Kesalahan:', error);
    res.status(500).send('Error loading page: ' + error.message);
  }
};

const getTransactions = async (req, res) => {
  try {
    const transactions = [
      {
        jenis_transaksi: "Remittance & Syariah",
        options: ["weselpos instan", "weselpos prima", "cash to account", "weselpos korporat", "weselpos luar negeri", "wesel pos dalam negeri", "syariah", "BPJS New"]
      },
      {
        jenis_transaksi: "Payment",
        options: ["pln", "telco", "pdam", "pajak daerah", "pajak nasional", "pinjaman"]
      },
      {
        jenis_transaksi: "fronting",
        options: ["BTN Penarikan", "BTN Penyetoran", "BTPN Penarikan", "BTPN Penyetoran"]
      },
      {
        jenis_transaksi: "bpm",
        options: ["meterai", "benda pos"]
      }
    ];

    res.json(transactions);
  } catch (error) {
    console.error('Kesalahan:', error);
    res.status(500).send('Error fetching transactions: ' + error.message);
  }
};

const loadAdmPelanggan = async (req, res) =>{
  const id = req.params.id;
  try{
      var infos = await Info.find(id)
      const reversedPosts = infos.reverse();
      res.render('admin/info', {user: req.session.user, infos:infos, infos: reversedPosts });
  }

  catch (error){
      console.log(error.message);
  }
}


const createPelanggan = async (req, res) => {
  const phoneNumber = req.body.tlp.replace(/[^+\d]/g, ''); // Format phone number
  const rawDate = req.body.tgl_transaksi;
  const formattedDate = new Date(rawDate).toISOString().split('T')[0]; // Format date

  try {
    // Generate the custom id_pelanggan
    const id_pelanggan = await generateCustomId(req.body.jenis_transaksi);

    const data = {
      id_pelanggan: id_pelanggan,
      nama: req.body.nama,
      tlp: phoneNumber,
      jenis_transaksi: req.body.jenis_transaksi,
      jml: req.body.jml,
      bsu: req.body.bsu,
      tgl_transaksi: formattedDate,
      alamat: req.body.alamat,
      kecamatan: req.body.kecamatan,
      rt: req.body.rt,
      rw: req.body.rw,
      kelurahan: req.body.kelurahan,
      kodepos: req.body.kodepos,
      kota: req.body.kota,
      provinsi: req.body.provinsi,
      status: 'belum',
      dokumentasi: req.body.dokumnetasi
    };

    // Save the new pelanggan to the database
    await Info.insertMany([data]);

    // Redirect to the pelanggan list page
    res.redirect('/pooc/pelanggan/get');
  } catch (error) {
    console.error('Kesalahan:', error);
    res.status(500).send('Error saving to database: ' + error.message);
  }
};

const loadUjipetik = async (req, res) =>{
  const id = req.params.id;
  try{
      var infos = await Info.find(id)
      const reversedPosts = infos.reverse();
      res.render('pooc/pelanggan/ujipetik', {user: req.session.user, infos:infos, infos: reversedPosts });
  }

  catch (error){
      console.log(error.message);
  }
}


const updateUjipetik = async (req, res) => {
  const id = req.params.id;
  const { status, jenis_ujipetik } = req.body;

  // Check if a file was uploaded and store its path
  const dokumentasi = req.file ? `/images/${req.file.filename}` : null; 

  try {
    // Update the database with new information
    await Info.findByIdAndUpdate(id, {
      status,
      dokumentasi,
      jenis_ujipetik
    });

    // Redirect to the specified route after successful update
    res.redirect('/pooc/pelanggan/ujipetik');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};





const loadUpdateUjipetik = async (req, res) =>{
  const id = req.params.id;
  try{
      const infos = await Info.findById({ _id: id });
      res.render('pooc/pelanggan/update_ujipetik', {user: req.session.user, infos:infos });
  }

  catch (error){
      console.log(error.message);
  }
}

const deletePelangganPooc = async (req, res) => {
  const id = req.params.id;
  try {
    await Info.findByIdAndDelete(id);
    res.redirect('/pooc/pelanggan/update_ujipetik');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

module.exports ={
  postInfo,
  updatePelanggan,
  loadUpdatePelanggan,
  deletePelanggan,
  loadPelanggan,
  loadCreate,
  loadAdmPelanggan,
  createPelanggan,
  getTransactions,
  generateCustomId,
  loadUjipetik,
  updateUjipetik,
  loadUpdateUjipetik,
  deletePelangganPooc
}
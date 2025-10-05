const mongoose=require("mongoose")

const pelangganSchema= new mongoose.Schema({
    id_pelanggan:{
        type:String
    },
    nama:{
        type:String,
        required:true
    },
    tlp:{
        type:String,
        required:true
    },
    jenis_transaksi:{
        type:String,
        required:true
    },
    jml:{
        type:String,
        required:true
    },
    bsu:{
        type:String,
        required:true
    },
    tgl_transaksi:{
        type: Date
    },
    alamat:{
        type:String,
        required:true
    },
    kecamatan:{
        type:String,
        required:true
    },
    rt:{
        type:String,
        required:true
    },
    rw:{
        type:String,
        required:true
    },
    kelurahan:{
        type:String,
        required:true
    },
    kodepos:{
        type:String,
        required:true
    },
    kota:{
        type:String,
        required:true
    },
    provinsi:{
        type:String,
        required:true
    },
    approval:{
        type:String
    },
    status:{
        type:String
    },
    jenis_ujipetik:{
        type:String
    },
    dokumentasi:{
        type:String
    }
})


const collection = new mongoose.model("pelanggan", pelangganSchema)

module.exports= collection

const User = require('../models/userModel');
const Info = require('../models/pelangganModel');
const Diskusi = require('../models/diskusiModel')

const Chat = require('../models/chatModel')
const bcrypt = require('bcrypt');
const saltRounds = 10;

const  landingLoad = async (req, res) => {
    res.render("landingpage")
  }

const  registerLoad = async (req, res) => {

    try{
        res.render('register')
    } catch (error) {
        console.log(error.message);
    }

}

const register = async (req, res)=>{
    try{
        const passwordHash = await bcrypt.hash(req.body.password, 10);

        const user = new User ({
            isVerified: true,
            email: req.body.email,
            nip: req.body.nip,
            fullname: req.body.fullname,
            tlp: req.body.tlp,
            username: req.body.username,
            password: passwordHash,
            role :req.body.role,
            isVerified: '0',
        });
        await user.save();

        res.render('login', {message: 'register successfully'})
    } catch (error) {
        console.log(error.message);
    }
}

const loadLogin = async (req, res) =>{
    try{
        res.render('login');
    }

    catch (error){
        console.log(error.message);
    }
}

const login = async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    
    try {
        const userData = await User.findOne({ username: username }).populate('role');
        if (userData) {
            console.log('User data found:', userData);
            const passwordMatched = await bcrypt.compare(password, userData.password);
            console.log('Password match:', passwordMatched);
            if (passwordMatched) {
                req.session.user = userData;
                if (userData.role === 'loket') {
                    res.redirect('/loket/dashboard');
                } else if (userData.role === 'pooc') {
                    res.redirect('/pooc/dashboard');
                } else if (userData.role === 'em') {
                    res.redirect('/em/dashboard');
                } else if (userData.role === 'cs') {
                    res.redirect('/cs/dashboard');
                }
                return;
            } else {
                console.log('Incorrect password.');
                res.render('login', { message: 'Email dan password salah' });
            }
        } else {
            console.log('User not found.');
            res.render('login', { message: 'Oops, email dan password anda salah' });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.render('login', { message: 'Cek kembali email dan password anda' });
    }
};


const logout = async (req, res) =>{
    try{
        req.session.destroy();
        res.redirect('/login');
    }

    catch (error){
        console.log(error.message);
    }
}

const loadDashboardEM = async (req, res) =>{
    const id = req.params.id;
    try{
        var infos = await Info.find(id);
        var diskusis = await Diskusi.find(id);
        var users = await User.find({_id: { $nin:[req.session.user._id] } });
        res.render('em/dashboard', {user: req.session.user, users:users, infos:infos, diskusis:diskusis });
    }

    catch (error){
        console.log(error.message);
    }
}

const loadDashboardLoket = async (req, res) =>{
    const id = req.params.id;
    try{
        var infos = await Info.find(id);
        var diskusis = await Diskusi.find(id);
        var users = await User.find({_id: { $nin:[req.session.user._id] } });
        res.render('loket/dashboard', {user: req.session.user, users:users,  infos:infos, diskusis:diskusis });
    }

    catch (error){
        console.log(error.message);
    }
}

const loadDashboardPooc = async (req, res) =>{
    const id = req.params.id;
    try{
        var infos = await Info.find(id);
        var diskusis = await Diskusi.find(id);
        var users = await User.find({_id: { $nin:[req.session.user._id] } });
        res.render('pooc/dashboard', {user: req.session.user, users:users, infos:infos, diskusis:diskusis });
    }

    catch (error){
        console.log(error.message);
    }
}

const loadDashboardCs = async (req, res) =>{
    const id = req.params.id;
    try{
        var infos = await Info.find(id);
        var diskusis = await Diskusi.find(id);
        var users = await User.find({_id: { $nin:[req.session.user._id] } });
        res.render('cs/dashboard', {user: req.session.user, users:users, infos:infos, diskusis:diskusis });
    }

    catch (error){
        console.log(error.message);
    }
}

const loadChatmhs = async (req, res) =>{
    try{
        var users = await User.find({_id: { $nin: [req.session.user._id] } })
        res.render('mahasiswa/chat-realtime', {user: req.session.user, users:users })
    }

    catch (error){
        console.log(error.message);
    }
}

const saveChat =  async(req, res) => {
    try{
        var chat = new Chat({
            sender_id:req.body.sender_id,
            receiver_id:req.body.receiver_id,
            message : req.body.message
        })
        
        var newChat = await chat.save();
        res.status(200).send({ success:true,msg:'Pesan terkirim', data:newChat} )
    }catch(error){
        res.status(400).send({ success:false,msg:error.message})
    }
}

const loadChatbot = async (req, res) =>{
    try{
        res.render('mahasiswa/chatbot', {user: req.session.user})
    }

    catch (error){
        console.log(error.message);
    }
}

const loadProfile = async (req, res) =>{
    try{
        res.render('mahasiswa/profile', {user: req.session.user})
    }

    catch (error){
        console.log(error.message);
    }
}


const loadDashboardADM = async (req, res) =>{
    const id = req.params.id;
    try{
        var infos = await Info.find(id);
        var diskusis = await Diskusi.find(id);
        var users = await User.find({_id: { $nin:[req.session.user._id] } });
        res.render('admin/dashboard', {user: req.session.user, users:users, infos:infos, diskusis:diskusis });
    }

    catch (error){
        console.log(error.message);
    }
}

const loadChatadm = async (req, res) =>{
    try{
        var users = await User.find({_id: { $nin: [req.session.user._id] } })
        res.render('admin/chat-realtime', {user: req.session.user, users:users })
    }

    catch (error){
        console.log(error.message);
    }
}

const loadChatbotAdmin = async (req, res) =>{
    try{
        res.render('admin/chatbot', {user: req.session.user})
    }

    catch (error){
        console.log(error.message);
    }
}

const loadProfileADM = async (req, res) =>{
    try{
        res.render('admin/profile', {user: req.session.user})
    }

    catch (error){
        console.log(error.message);
    }
}

const loadDataUser = async (req, res) => {
    const id = req.params.id;
    try {
      const users = await User.find(id);
      res.render('em/data_user/get_user', { users:req.session.user, users:users});
    } catch (err) {
      console.error('Kesalahan:', err);
      res.sendStatus(500);
    }
  }

  const createDataUser = async (req, res) =>{
    try{
        res.render('em/data_user/create_user', {user: req.session.user})
    }

    catch (error){
        console.log(error.message);
    }
}

const hashExistingPasswords = async () => {
    try {
        const users = await User.find({});

        for (let user of users) {
            if (!user.password.startsWith('$2b$')) { // Check if password is already hashed
                const hashedPassword = await bcrypt.hash(user.password, saltRounds);
                user.password = hashedPassword;
                await user.save();
            }
        }

        console.log('All passwords hashed successfully');
    } catch (error) {
        console.error('Error hashing passwords:', error);
    }
};

  const postDataUser = async (req, res)=>{
    try{
        const { email, nip, fullname, tlp,  username, password, role} = req.body;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const newPost = new User({
            email,
            nip,
            fullname,
            tlp,
            username,
            password: hashedPassword,
            role,
            isVerified: true,
        });
    
        User.insertMany([newPost])
        .then(() => {
          res.redirect('em/data_user/get_user');
        })
    } catch (error) {
        console.log(error.message);
    }
}



const updateDataUser = async (req, res) => {
    const id = req.params.id;
    try{
        const users = await User.findById({ _id: id });
        res.render('em/data_user/update_user',{user: req.session.user, users:users });
    }catch{
        (err => console.log(err));
  }
}

 const postUpdateDataUser = async (req, res) => {
    const id = req.params.id;
    const { email, nip, fullname, tlp,  username, password, role } = req.body;
    User.findByIdAndUpdate(id, { email, nip, fullname, tlp,  username, password, role})
      .then(() => {
        res.redirect('/em/data_user/get_user');
      })
      .catch(err => console.log(err));
  }

  const deleteDataUser = async (req, res) => {
    const id = req.params.id;
    User.findByIdAndDelete(id)
        .then(() => {
            res.redirect('/em/data_user/get_user');
        })
        .catch(err => {
            console.log(err);
            res.status(500).send('Server Error');
        });
  }

  const postUpdateKonfirmasi = async (req, res) => {
    const id = req.params.id;
    User.findByIdAndUpdate(id, { isVerified})
        .then(() => {
            res.redirect('/admin/data_user');
        })
        .catch(err => {
            console.log(err);
            res.status(500).send('Server Error');
        });
  }

  

  
module.exports ={
    landingLoad,
    registerLoad,
    register,
    loadLogin,
    login,
    logout,
    loadDashboardEM,
    loadDashboardLoket,
    loadChatmhs,
    saveChat,
    loadChatbot,
    loadProfile,
    loadDashboardADM,
    loadChatadm,
    loadChatbotAdmin,
    loadProfileADM,
    loadDataUser,
    createDataUser,
    postDataUser,
    updateDataUser,
    postUpdateDataUser,
    deleteDataUser,
    postUpdateKonfirmasi,
    loadDashboardPooc,
    hashExistingPasswords,
    loadDashboardCs
}

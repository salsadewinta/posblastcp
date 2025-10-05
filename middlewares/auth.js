const isLoket = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'loket') {
      return next();
    } else {
      res.redirect('/login'); 
    }
  };
  
  const isEM = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'em') {
      return next();
    } else {
      res.redirect('/login'); // atau sesuaikan dengan rute login mahasiswa
    }
  };

  const isPooc = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'pooc') {
      return next();
    } else {
      res.redirect('/login'); // atau sesuaikan dengan rute login mahasiswa
    }
  };

  const isCs = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'cs') {
      return next();
    } else {
      res.redirect('/login'); // atau sesuaikan dengan rute login mahasiswa
    }
  };

const isLogin = async (req, res, next)=>{
    try{
        if(req.session.user){

        }else{
            res.redirect('/');
        }
        next();
    }catch{

    }
}

const isLogout = async (req, res, next)=>{
    try{
        if(req.session.user){
            res.redirect('/dashboard')
        }
        next();
    }catch{

    }
}

module.exports = {
    isEM,
    isLoket,
    isLogin,
    isPooc,
    isLogout,
    isCs
}
const Message = require('../models/messageModel');

const loadMessages = async (req, res) => {
  try {
    const messages = await Message.find();
    res.render('em/pesan/get_pesan', { user: req.session.user, messages });
  } catch (error) {
    console.error('Error loading messages:', error);
    res.status(500).send('Error loading messages');
  }
};

const loadCreate = async (req, res) => {
    try {
      const Messages = await Message.find({});
      res.render('em/pesan/create_pesan', {
        user: req.session.user,
        messages: Messages
      });
    } catch (error) {
      console.error('Kesalahan:', error);
      res.status(500).send('Error loading page: ' + error.message);
    }
  };

  const createMessage = async (req, res) => {
    try {
      const { title, body } = req.body;
      const foto = req.file ? `/images/${req.file.filename}` : null; // Handling the uploaded file
      const newMessage = new Message({ title, body, foto });
      await newMessage.save();
      res.redirect('/em/pesan/get_pesan');
    } catch (error) {
      console.error('Error creating message:', error);
      res.status(500).send('Error creating message');
    }
  };
  
  
const updateMessage = async (req, res) => {
  const id = req.params.id;
    const {title, body } = req.body;
    Message.findByIdAndUpdate(id, { title, body })
      .then(() => {
        res.redirect('/em/pesan/get_pesan');
      })
      .catch(err => console.log(err));
}


const loadUpdateMessages = async (req, res) =>{
  const id = req.params.id;
  try{
      const messages = await Message.findById({ _id: id });
      res.render('em/pesan/update_pesan', {user: req.session.user, messages:messages });
  }

  catch (error){
      console.log(error.message);
  }
}

const deleteMessage = async (req, res) => {
    const id = req.params.id;
    try {
      await Message.findByIdAndDelete(id);
      res.redirect('/em/pesan/get_pesan');
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  };


  const renderBlastForm = async (req, res) => {
    try {
      const messages = await Message.find(); // Fetch all messages from the database
      res.render('em/wablast/create_blast', { messages }); // Pass messages to the EJS template
    } catch (error) {
      console.error('Error fetching messages:', error);
      res.status(500).send('Error loading the blast form');
    }
  };
  
module.exports = {
  loadMessages,
  loadCreate,
  createMessage,
  updateMessage,
  deleteMessage,
  renderBlastForm,
  loadUpdateMessages
};

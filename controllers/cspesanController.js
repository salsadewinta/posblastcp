const Message = require('../models/messageModel');

const loadMessagesCS = async (req, res) => {
  try {
    const messages = await Message.find();
    res.render('cs/pesan/get_pesan', { user: req.session.user, messages });
  } catch (error) {
    console.error('Error loading messages:', error);
    res.status(500).send('Error loading messages');
  }
};

const loadCreateCs = async (req, res) => {
    try {
      const Messages = await Message.find({});
      res.render('cs/pesan/create_pesan', {
        user: req.session.user,
        messages: Messages
      });
    } catch (error) {
      console.error('Kesalahan:', error);
      res.status(500).send('Error loading page: ' + error.message);
    }
  };

  const createMessageCs = async (req, res) => {
    try {
      const { title, body } = req.body;
      const foto = req.file ? `/images/${req.file.filename}` : null; // Handling the uploaded file
      const newMessage = new Message({ title, body, foto });
      await newMessage.save();
      res.redirect('/cs/pesan/get_pesan');
    } catch (error) {
      console.error('Error creating message:', error);
      res.status(500).send('Error creating message');
    }
  };
  
  
const updateMessageCs = async (req, res) => {
  const id = req.params.id;
    const {title, body } = req.body;
    Message.findByIdAndUpdate(id, { title, body })
      .then(() => {
        res.redirect('/cs/pesan/get_pesan');
      })
      .catch(err => console.log(err));
}


const loadUpdateMessagesCs = async (req, res) =>{
  const id = req.params.id;
  try{
      const messages = await Message.findById({ _id: id });
      res.render('cs/pesan/get_pesan', {user: req.session.user, messages:messages });
  }

  catch (error){
      console.log(error.message);
  }
}

const deleteMessageCs = async (req, res) => {
    const id = req.params.id;
    try {
      await Message.findByIdAndDelete(id);
      res.redirect('/cs/pesan/get_pesan');
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  };


  const renderBlastFormCs = async (req, res) => {
    try {
      const messages = await Message.find(); // Fetch all messages from the database
      res.render('cs/wablast/create_blast', { messages }); // Pass messages to the EJS template
    } catch (error) {
      console.error('Error fetching messages:', error);
      res.status(500).send('Error loading the blast form');
    }
  };
  
module.exports = {
  loadCreateCs,
  createMessageCs,
  updateMessageCs,
  deleteMessageCs,
  renderBlastFormCs,
  loadUpdateMessagesCs,
  loadMessagesCS
};

const Message = require('../models/messageModel');
const Wablast = require('../models/blastModel');
const Pelanggan = require('../models/pelangganModel');
const twilio = require('twilio');
require('dotenv').config(); 

// Setup Twilio client
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = new twilio(accountSid, authToken);


// Function to send blast messages to all customers
const sendBlast = async (req, res) => {
    try {
      const { messageId } = req.body;
      const message = await Message.findById(messageId);
      const pelanggan = await Pelanggan.find({});
  
      pelanggan.forEach(async (p) => {
        try {
          await client.messages.create({
            body: message.body,
            from: 'whatsapp:+12057750141', // Your Twilio WhatsApp number
            to: `whatsapp:${p.tlp}`
          });
        } catch (error) {
          console.error('Failed to send message to:', p.tlp, error);
        }
      });
  
      // Save to Wablast collection
      const wablast = new Wablast({
        message: message._id,  // Reference the Message document
        title: message.title,
        date: new Date(),
      });
      await wablast.save();
  
      res.redirect('/em/pesan/create_user'); // Redirect to a success page or listing page
    } catch (error) {
      console.error('Error sending blast:', error);
      res.status(500).send('Error sending blast');
    }
  };
  
// Export the functions as needed
module.exports = {
  sendBlast
};

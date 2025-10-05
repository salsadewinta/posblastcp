const { exec } = require('child_process');

const sendBlastPooc = async (req, res) => {
    try {
        const { messageId } = req.body;

        if (!messageId) {
            return res.status(400).send('Message ID is required');
        }

        // Call Python script with messageId
        exec(`python python_scripts/send_blast.py ${messageId}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing Python script: ${error.message}`);
                console.error(stderr);
                return res.status(500).send('Error sending blast');
            }

            // Log the output from the Python script
            console.log(`Python script output: ${stdout}`);

            // Check if the output indicates a successful operation
            if (stdout.includes("All messages sent successfully")) {
                return res.redirect('/pooc/wablast/create_blast');
            } else if (stdout.includes("Message not found!")) {
                return res.status(404).send('Message not found in database');
            } else if (stdout.includes("Sending message:")) {
                console.log("Message is being sent, check later for confirmation.");
                return res.redirect('/pooc/wablast/create_blast');
            } else {
                console.error(`Unexpected output from Python script: ${stdout}`);
                return res.status(500).send('Unexpected error during blast process');
            }
        });

    } catch (error) {
        console.error('Error sending blast:', error);
        res.status(500).send('Error sending blast');
    }
};

module.exports = {
  sendBlastPooc
};

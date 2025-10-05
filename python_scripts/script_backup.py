from pymongo import MongoClient
import pyautogui
import pywhatkit
import time
from bson import ObjectId
import sys
import os

# Connect to MongoDB
client = MongoClient("mongodb://localhost:27017/")
db = client['dbpos']
messages_collection = db['messages']
customers_collection = db['pelanggans']

def send_blast(message_id):
    # Fetch the message data from MongoDB
    message = messages_collection.find_one({"_id": ObjectId(message_id)})
    if not message:
        print("Message not found!")
        return

    customers = customers_collection.find({})
    
    # Extract the message body and image path
    message_body = message.get('body', '')
    message_image = message.get('foto', '')  # Assumes 'foto' contains the path to the image file

    # Log the message details
    print(f"Message to send: {message_body}")
    print(f"Image path: {message_image}")

    for customer in customers:
        # Adjust the phone number format from MongoDB
        phone_number = customer.get('tlp', '')

        try:
            # Log before sending
            print(f"Attempting to send message to {phone_number}")

            # Open WhatsApp Web and wait for it to load
            pywhatkit.sendwhatmsg_instantly(f"+{phone_number}", message_body)
            print(f"Opened WhatsApp Web for {phone_number}")
            time.sleep(15)  # Wait for WhatsApp Web to fully load

            if message_image and os.path.exists(f"/images/{message_image}"):
                # Click the attachment icon
                pyautogui.click(x=your_image_icon_x_coordinate, y=your_image_icon_y_coordinate)
                time.sleep(5)  # Wait for the attachment dialog to open

                # Drag-and-drop the image
                pyautogui.moveTo(x=your_image_icon_x_coordinate, y=your_image_icon_y_coordinate)
                pyautogui.dragTo(x=your_message_input_x_coordinate, y=your_message_input_y_coordinate, duration=2)
                time.sleep(5)  # Wait for the image upload to start

                # Send the message with the image
                pyautogui.click(x=your_send_button_x_coordinate, y=your_send_button_y_coordinate)
                print(f"Image sent successfully to {phone_number}")

            else:
                # If no image, send the message directly
                pyautogui.click(x=your_send_button_x_coordinate, y=your_send_button_y_coordinate)
                print(f"Message sent successfully to {phone_number}")

        except Exception as e:
            print(f"Failed to send message to {phone_number}: {str(e)}")

    print("All messages sent successfully!")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        send_blast(sys.argv[1])
    else:
        print("Please provide a message_id.")

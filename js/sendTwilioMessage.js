import 'dotenv/config';
const ACCOUNT_SID = process.env.ACCOUNT_SID;
const AUTH_TOKEN = process.env.AUTH_TOKEN;
import client  from ('twilio')(ACCOUNT_SID, AUTH_TOKEN);

export const sendSMS = (phoneNumber, message) => {
    if (!phoneNumber) return;
    client.messages
        .create({
            body: message,
            from: 'YOUR_TWILIO_PHONE_NUMBER',
            to: phoneNumber
        })
        .then(message => console.log('Message sent:', message.sid))
        .catch(error => console.error('Error:', error));
}
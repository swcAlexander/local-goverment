export const sendViberMessage = (phone, message) => {
    if (!phone) return;
  fetch('https://chatapi.viber.com/pa/send_message', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Viber-Auth-Token': 'YOUR_VIBER_AUTH_TOKEN'
    },
    body: JSON.stringify({
      receiver: phone,
      min_api_version: 1,
      sender: {
        name: "Your Bot Name",
        avatar: "https://example.com/avatar.jpg"
      },
      tracking_data: "tracking data",
      type: "text",
      text: message
    })
  })
  .then(response => response.json())
  .then(data => {
    console.log('Viber message sent:', data);
  })
  .catch(error => {
    console.error('Error sending Viber message:', error);
  });
}
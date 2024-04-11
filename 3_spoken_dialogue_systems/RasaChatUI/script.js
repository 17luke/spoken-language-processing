const msgerForm = get(".msger-inputarea");
const msgerInput = get(".msger-input");
const msgerChat = get(".msger-chat");

const BOT_MSG = "Nothing yet";

const BOT_IMG = "";
const PERSON_IMG = "";
const BOT_NAME = "BOT";
const PERSON_NAME = "USER";

msgerForm.addEventListener("submit", event => {
  event.preventDefault();

  const msgText = msgerInput.value;
  if (!msgText) return;

  appendMessage(PERSON_NAME, PERSON_IMG, "right", msgText);
  msgerInput.value = "";
  // Send user input as a POST request to port 5005
  fetch('http://localhost:5005/webhooks/rest/webhook', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      sender: PERSON_NAME,
      message: msgText
    })
  })
  .then(response => response.json())
  .then(data => {
    // Check if the response JSON is empty
    if (data.length === 0) {
        // If the response JSON is empty, append a message with an empty string
        appendMessage(BOT_NAME, BOT_IMG, "left", "");
    } else {
        // If the response JSON is not empty, iterate over each element
        data.forEach(element => {
            if (element.text) {
                // If the element contains text, append the text message
                appendMessage(BOT_NAME, BOT_IMG, "left", element.text);
            } else if (element.image) {
                // If the element contains an image, just treat the image url as text message
                appendMessage(BOT_NAME, BOT_IMG, "left", element.image);
            }
            // else just append message but with empty string
            else {
                appendMessage(BOT_NAME, BOT_IMG, "left", "");
            }
        });
    }
})
  .catch(error => {
    console.error('Error:', error);
  });
});

function appendMessage(name, img, side, text) {
  //   Simple solution for small apps
  const msgHTML = `
    <div class="msg ${side}-msg">
      <div class="msg-img" style="background-image: url(${img})"></div>

      <div class="msg-bubble">
        <div class="msg-info">
          <div class="msg-info-name">${name}</div>
          <div class="msg-info-time">${formatDate(new Date())}</div>
        </div>

        <div class="msg-text">${text}</div>
      </div>
    </div>
  `;

  msgerChat.insertAdjacentHTML("beforeend", msgHTML);
  msgerChat.scrollTop += 500;
}

// function botResponse() {
//   const msgText = BOT_MSG;
//   const delay = msgText.split(" ").length * 100;

//   setTimeout(() => {
//     appendMessage(BOT_NAME, BOT_IMG, "left", msgText);
//   }, delay);
// }

// Utils
function get(selector, root = document) {
  return root.querySelector(selector);
}

function formatDate(date) {
  const h = "0" + date.getHours();
  const m = "0" + date.getMinutes();

  return `${h.slice(-2)}:${m.slice(-2)}`;
}

function random(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

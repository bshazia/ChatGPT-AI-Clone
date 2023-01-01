import bot from './assets/bot.svg';
import user from './assets/user.svg';


const form = document.querySelector('form');
const chatContainer = document.querySelector('#chat_container');

let loadInterval;

//implement the loading function to show that AI is thinking 
function loader(element) {
  // first an empty string 
  element.textContent = '';

  //function that accepts another callback function and as the second parameter it accepts a number of milliseconds
  loadInterval = setInterval(() => {
    element.textContent += '.';

    if (element.textContent === '....') {
      element.textContent = '';
    }
  }, 300)
}
// to write charecter by charector 
function typeText(element, text) {
  let index = 0;

  let interval = setInterval(() => {
    if (index < text.length) {
      element.innerHTML += text.charAt(index);
      index++;
    } else {
      clearInterval(interval);
    }
  },20)
}
//generate a unique ID ifor load ai's answers
function genrateUniqueId() {
  const timestamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);

  return `id-${timestamp}-${hexadecimalString}`;
}

// chat stripe function
function chatStripe(isAi, value, uniqueId) {
  return (
  `
      <div class="wrapper ${isAi && 'ai'}" >
        <div class="chat">
          <div class="profile">
            <img
              src='${isAi ? bot : user}'
              alt='${isAi ? 'bot':'user'}'
            />
          </div>
          <div class="message" id=${uniqueId}>${value}</div>
        </div>
      </div >
  `
  )
}
//create trigger function
const handleSubmit = async (e) => {
  // prevent auto render the browser
  e.preventDefault();

  const data = new FormData(form);

  //user`s chatstripe
  chatContainer.innerHTML += chatStripe(false, data.get('prompt'));

  form?.reset();

  //bot`s chatstripe
  const uniqueId = genrateUniqueId();
  chatContainer.innerHTML += chatStripe(true, " ", uniqueId);

  chatContainer.scrollTop = chatContainer.scrollHeight;

  //create unique id for every message
  const messageDiv = document.getElementById(uniqueId);

//now lets load
  loader(messageDiv);

    //fetch data from server -> bot's response
  const response = await fetch('http://localhost:8888', {
    method: 'POST',
    headers: {
      'Content-Type':'application/json'
    },
    //display on screen
    body: JSON.stringify({
      prompt: data.get('prompt')
    })
  })
  //clear interval
  clearInterval(loadInterval);
  messageDiv.innerHTML = '';
  
  if (response.ok) {
    const data = await response.json();
    const parsedData = data.bot.trim();
    
    typeText(messageDiv, parsedData);
  } else {
    const err = await response.json();
    messageDiv.innerHTML = "Somethinkg went wrong";

    alert(err);
  }
}


//call the handle function or function for enter key
form?.addEventListener('submit', handleSubmit);
form?.addEventListener('keyup', (e) => {
  //enter key code
  if (e.keyCode === 13) {
    handleSubmit(e);
  }
})

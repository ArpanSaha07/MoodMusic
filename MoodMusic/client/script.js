import bot from './assets/bot.svg'
import user from './assets/user.svg'

const form = document.querySelector('form')
const chatContainer = document.querySelector('#chat_container')

let loadInterval;

//Shows that a message is loading
function loader(element) {
    element.textContent = ''

    loadInterval = setInterval(() => {
        // Update the text content of the loading indicator
        element.textContent += '.';

        // If the loading indicator has reached three dots, reset it
        if (element.textContent === '....') {
            element.textContent = '';
        }
    }, 300);
}

function typeText(element, text) {
    let index = 0

    let interval = setInterval(() => {
        if (index < text.length) {
            element.innerHTML += text.charAt(index)
            index++
        } else {
            clearInterval(interval)
        }
    }, 20)
}

// generate unique ID for each message div of bot
// necessary for typing text effect for that specific reply
// without unique ID, typing text will work on every element
function generateUniqueId() {
    const timestamp = Date.now();
    const randomNumber = Math.random();
    const hexadecimalString = randomNumber.toString(16);

    return `id-${timestamp}-${hexadecimalString}`;
}

//I used template strings and not regular strings, because with regular string we cannot create spaces or enters
// value: AI generated message
function chatStripe(isAi, value, uniqueId) {
    return (  
        `
        <div class="wrapper ${isAi && 'ai'}">
            <div class="chat">
                <div class="profile">
                    <img 
                      src=${isAi ? bot : user} 
                      alt="${isAi ? 'bot' : 'user'}" 
                    />
                </div>
                <div class="message" id=${uniqueId}>${value}</div>
            </div>
        </div>
    `
    )
}

const handleSubmit = async (e) => {
    e.preventDefault()  // default browser behavior after submitting a form is to reload the browser, which we do not want to happen

    const data = new FormData(form)

    // user's chatstripe
    chatContainer.innerHTML += chatStripe(false, data.get('prompt'))

    // to clear the textarea input 
    form.reset()

    // bot's chatstripe
    const uniqueId = generateUniqueId()
    chatContainer.innerHTML += chatStripe(true, " ", uniqueId)

    // to focus scroll to the bottom 
    chatContainer.scrollTop = chatContainer.scrollHeight;

    // specific message div 
    const messageDiv = document.getElementById(uniqueId)

    // messageDiv.innerHTML = "...."
    loader(messageDiv)

    const response = await fetch('http://localhost:5000/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            prompt: data.get('message.content')
        })
    })

    clearInterval(loadInterval)
    messageDiv.innerHTML = ""

    if (response.ok) {
        const data = await response.json();
        const parsedData = data.bot.trim() // trims any trailing spaces/'\n' 

        typeText(messageDiv, parsedData)
    } else {
        const err = await response.text()

        messageDiv.innerHTML = "Something went wrong"
        alert(err)
    }
}

form.addEventListener('submit', handleSubmit)
form.addEventListener('keyup', (e) => {
    if (e.keyCode === 13) {
        handleSubmit(e)
    }
})

// const toggleButton = document.getElementById('toggleButton');
// const sidebar = document.querySelector('.sidebar');
// const content = document.querySelector('.content');

// toggleButton.addEventListener('click', () => {
//     if (sidebar.style.left === '-250px') {
//         sidebar.style.left = '0';
//         content.style.marginLeft = '250px';
//     } else {
//         sidebar.style.left = '-250px';
//         content.style.marginLeft = '0';
//     }
// });


const spawner = require('child_process').spawn;

// string
const data_to_pass_in = 'Send this to python script';

// array
// const data_to_pass_in = ['Send this to python script']

console.log('Data sent to python:', data_to_pass_in);

const python_process = spawner('python', ['./test.py', data_to_pass_in]);

python_process.stdout.on('data', (data) => {
    console.log('Data received from python script:', data.toString());
});

const socket = io();
const loginForm = document.getElementById('welcome-form');
const messagesSection = document.getElementById('messages-section');
const messagesList = document.getElementById('messages-list');
const addMessageForm = document.getElementById('add-messages-form');
const userNameInput = document.getElementById('username');
const messageContentInput = document.getElementById('message-content');
const usersList = document.getElementById('users-online');
const usersCount = document.getElementById('users-count');

let userName = '';
let users = [];

const login = event => {
  event.preventDefault();
  if (userNameInput.value.length) {
    userName = userNameInput.value;
    toggle();
    socket.emit('newMember', {
      user: userName,
    });
  } else {
    alert('Your name have to have length :)');
  }
};

loginForm.addEventListener('submit', login);

const addMessage = (author, content) => {
  const message = document.createElement('li');
  message.classList.add('message');
  if(author === userName) message.classList.add('message--self')
    else if(author === 'Chat Bot') message.classList.add('message--bot')
    else message.classList.add('message--received');

  message.innerHTML = `
    <h3 class="message__author">${userName === author ? 'You' : author }</h3>
    <div class="message__content">
      ${content}
    </div>
  `;
  messagesList.appendChild(message);
};

const sendMessage = event => {
  event.preventDefault();

  let messageContent = messageContentInput.value;

  if(!messageContent.length) {
    alert('Type something before pressing the button!');
  }
  else {
    addMessage(userName, messageContent);
    socket.emit('message', { author: userName, content: messageContent })
    messageContentInput.value = '';
  }

};

addMessageForm.addEventListener('submit', sendMessage);

function toggle() {
  loginForm.classList.remove('show');
  messagesSection.classList.add('show');
}

socket.on('message', ({ author, content }) => addMessage(author, content))

const handleUsers = usr => {
  users = [...usr];
  usersCount.innerHTML = `Users online: ${users.length}`;
  usersList.innerHTML = '';
  for (const u of users) {
    const li = document.createElement('li');
    li.textContent = u.name;
    usersList.appendChild(li);
  }
  console.log(users);
};

socket.on('users', ({ users }) => handleUsers(users));

/* eslint-disable no-alert */
/* eslint-disable no-plusplus */
/* eslint-disable no-undef */
const nickname = prompt('What is your nickname?');

let counter = 0;

const socket = io({
  auth: {
    serverOffset: 0,
    nickname,
  },
  ackTimeout: 10000,
  retries: 3,
});

const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (input.value) {
    const clientOffset = `${socket.id}-${counter++}`;
    socket.emit('chat message', input.value, clientOffset);
    const item = document.createElement('li');
    item.textContent = `You: ${input.value}`;
    input.value = '';
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
  }
});

input.addEventListener('change', () => {
  socket.emit('typing', nickname);
});

socket.on('typing', (user) => {
  const item = document.createElement('li');
  item.textContent = `${user} is typing...`;
  item.style.color = 'green';
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});

socket.on('chat message', (msg, serverOffset) => {
  const item = document.createElement('li');
  item.textContent = msg;
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
  socket.auth.serverOffset = serverOffset;
});

['user connected', 'user disconnected'].forEach((event) => {
  socket.on(event, (socketId) => {
    const item = document.createElement('li');
    item.style.color = 'red';
    item.textContent = `${event}: ${socketId}`;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
  });
});

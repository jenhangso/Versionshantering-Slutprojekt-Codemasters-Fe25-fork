import { db } from "./firebase.js";
import { ref, push, onValue } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
const form = document.getElementById("messageForm");
const nameInput = document.getElementById("name");
const messageInput = document.getElementById("message");
const statusMessage = document.getElementById("statusMessage");
const messagesContainer = document.getElementById("messagesContainer");
const themeToggle = document.getElementById("themeToggle");
console.log(themeToggle);
function saveMessage(name, message) {
  const messagesRef = ref(db, "messages");

  push(messagesRef, {
    name: name,
    message: message,
    createdAt: new Date().toISOString()
  });
}

function loadMessages() {
  const messagesRef = ref(db, "messages");

  onValue(messagesRef, (snapshot) => {
    const data = snapshot.val();

    messagesContainer.innerHTML = "";

    if (!data) {
      messagesContainer.innerHTML = "<p>Inga meddelanden ännu</p>";
      return;
    }

    Object.values(data).forEach((msg) => {
      const div = document.createElement("div");

      div.innerHTML = `
        <h3>${msg.name}</h3>
        <p>${msg.message}</p>
        <small>${new Date(msg.createdAt).toLocaleString("sv-SE")}</small>
      `;

      messagesContainer.appendChild(div);
    });
  });
}

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = nameInput.value.trim();
  const message = messageInput.value.trim();

  if (name === "" || message === "") {
    statusMessage.textContent = "Du måste fylla i både namn och meddelande.";
    statusMessage.style.color = "red";
    return;
  }

  saveMessage(name, message);

  statusMessage.textContent = "Meddelandet sparades!";
  statusMessage.style.color = "green";

  form.reset();
});

loadMessages();
function applySavedTheme() {
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
  }
}

themeToggle.addEventListener("click", function () {
  document.body.classList.toggle("dark-mode");

  if (document.body.classList.contains("dark-mode")) {
    localStorage.setItem("theme", "dark");
  } else {
    localStorage.setItem("theme", "light");
  }
});

applySavedTheme();
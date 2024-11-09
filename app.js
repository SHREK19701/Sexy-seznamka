// Nastavení počátečního počtu mincí pro nově registrované uživatele
let userCoins = 150;

// Funkce pro aktualizaci tlačítka pro odesílání zpráv
function updateSendButtonState() {
    const sendButton = document.getElementById('sendButton');
    if (sendButton) {
        sendButton.disabled = userCoins <= 0;
    }
}

// Funkce pro odeslání zprávy
function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const messageDisplay = document.getElementById('messageDisplay');

    if (userCoins > 0 && messageInput.value.trim() !== "") {
        userCoins--;
        const newMessage = document.createElement('p');
        newMessage.textContent = messageInput.value;
        messageDisplay.appendChild(newMessage);
        messageInput.value = '';
        updateSendButtonState();
    } else if (userCoins <= 0) {
        alert("Nemáte dostatek mincí pro odeslání zprávy. Kupte si další mince.");
    }
}

// Zpracování formuláře registrace
function handleRegistration(event) {
    event.preventDefault();
    alert('Registrace byla úspěšná!');
    window.location.href = 'profil.html'; 
}

// Funkce pro zpracování URL parametrů
function fillFormFieldsFromParams() {
    const params = new URLSearchParams(window.location.search);
    const formFields = ['username', 'password', 'birthdate', 'height', 'weight', 'eyes', 'hair', 'children', 'job', 'hobbies', 'orientation', 'search'];

    formFields.forEach(field => {
        const input = document.getElementById(field);
        if (input) {
            input.value = params.get(field) || '';
        }
    });
}

// Funkce pro inicializaci stránky
function initializePage() {
    const registrationForm = document.getElementById('registrationForm');
    if (registrationForm) {
        registrationForm.addEventListener('submit', handleRegistration);
    }
    
    fillFormFieldsFromParams();
    updateSendButtonState();

    const sendButton = document.getElementById('sendButton');
    if (sendButton) {
        sendButton.addEventListener('click', sendMessage);
    }
}

// Spuštění inicializace po načtení obsahu stránky
document.addEventListener('DOMContentLoaded', initializePage);


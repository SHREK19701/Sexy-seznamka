let tokenCount = 0; // Počet žetonů na začátku

// Funkce pro validaci registrace
function validateRegistration(event) {
    event.preventDefault(); // Zabránit obnovení stránky
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const username = document.getElementById('username').value;

    if (password !== confirmPassword) {
        alert("Hesla se neshodují!");
        return false;
    }

    let currentUser = {
    username: 'User123', // Zde bude uživatelské jméno
    email: 'user@example.com', // Zde bude email
    tokenCount: 200 // Počet žetonů
};


function showProfile() {
    document.getElementById('profile-username').innerText = currentUser.username;
    document.getElementById('profile-email').innerText = currentUser.email;
    document.getElementById('profile-token-count').innerText = currentUser.tokenCount;
    showSection('profile'); // Zobrazit sekci profilu
}

function editProfile() {
    document.getElementById('edit-username').value = currentUser.username;
    document.getElementById('edit-email').value = currentUser.email;
    document.getElementById('edit-profile').classList.remove('hidden'); // Zobrazit formulář pro úpravu
}

function saveProfile() {
    const newUsername = document.getElementById('edit-username').value.trim();
    const newEmail = document.getElementById('edit-email').value.trim();

    if (newUsername === '' || newEmail === '') {
        alert('Vyplňte prosím všechna pole.');
        return;
    }

    // Uložení změn do currentUser
    currentUser.username = newUsername;
    currentUser.email = newEmail;

    // Aktualizace zobrazených informací
    showProfile(); // Znovu zobrazit sekci profilu
    document.getElementById('edit-profile').classList.add('hidden'); // Skrýt formulář pro úpravu
    alert('Profil byl úspěšně aktualizován!');
}

function cancelEdit() {
    document.getElementById('edit-profile').classList.add('hidden'); // Skrýt formulář pro úpravu
}

    // Uložení změn do currentUser
    currentUser.username = newUsername;
    currentUser.email = newEmail;
function updateProfile() {
    document.getElementById('username-display').innerText = document.getElementById('username').value; // nebo jiný způsob, jak získat uživatelské jméno
    // Další aktualizace informací profilu
}

    // Aktualizace zobrazených informací
    showProfile(); // Znovu zobrazit sekci profilu
    document.getElementById('edit-profile').classList.add('hidden'); // Skrýt formulář pro úpravu
    alert('Profil byl úspěšně aktualizován!');
}

function cancelEdit() {
    document.getElementById('edit-profile').classList.add('hidden'); // Skrýt formulář pro úpravu
}



function uploadPhoto() {
    const fileInput = document.getElementById("photoUpload");
    const file = fileInput.files[0];

    // Zkontroluje, zda byl vybrán soubor
    if (!file) {
        alert("Prosím, vyberte fotku.");
        return;
    }

    const reader = new FileReader();
    reader.onload = function(event) {
        const imgElement = document.getElementById("previewImage");
        imgElement.src = event.target.result;
        imgElement.style.display = "block";

        // Uložení obrázku do localStorage
        try {
            localStorage.setItem("profilePhoto", event.target.result);
            alert("Fotka byla úspěšně nahrána!");
        } catch (error) {
            alert("Došlo k chybě při ukládání fotky do localStorage.");
            console.error("Error:", error);
        }
    };

    // Přidáme obslužnou funkci pro chybu
    reader.onerror = function(error) {
        alert("Došlo k chybě při načítání fotky.");
        console.error("FileReader error:", error);
    };

    // Načte soubor jako URL obrázku
    reader.readAsDataURL(file);
}

// Zobrazení uložené fotky při načtení stránky
window.onload = function() {
    const savedPhoto = localStorage.getItem("profilePhoto");
    if (savedPhoto) {
        const imgElement = document.getElementById("previewImage");
        imgElement.src = savedPhoto;
        imgElement.style.display = "block";
    }
};



// Inicializace tokenCount a zobrazení
    tokenCount = 200;
    updateTokenDisplay();

    alert("Registrace proběhla úspěšně! Získali jste 200 žetonů.");
    displayProfile();
    return false; // Zabránit obnovení stránky
}

// Funkce pro zobrazení profilu
function displayProfile() {
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
        const userData = JSON.parse(storedUserData);
        document.getElementById('profileUsername').innerText = userData.username;
        tokenCount = userData.tokens; // Nastavení tokenCount na uloženou hodnotu
        updateTokenDisplay(); // Funkce pro aktualizaci zobrazení žetonů
        showSection('profile');
    }
}

// Funkce pro aktualizaci zobrazení žetonů
function updateTokenDisplay() {
    document.getElementById('token-count').innerText = tokenCount;
}

// Funkce pro zobrazení sekcí
function showSection(section) {
    const sections = ['registration', 'profile', 'chat'];
    sections.forEach(sec => {
        const element = document.getElementById(sec);
        if (element) {
            element.classList.add('hidden');
        }
    });

    const targetSection = document.getElementById(section);
    if (targetSection) {
        targetSection.classList.remove('hidden');
    }
}

// Funkce pro přepnutí na chat
function showChat() {
    document.getElementById('token-count-chat').innerText = tokenCount; // Zobrazení žetonů v chatu
    showSection('chat');
}

// Funkce pro odeslání zprávy
function sendMessage() {
    const messageInput = document.getElementById('message');
    const messageContainer = document.getElementById('message-container');

    const message = messageInput.value;
    if (message.trim() === '') return; // Neodesílat prázdné zprávy

    if (tokenCount < 50) { // Zkontrolovat, zda má uživatel dostatek žetonů
        alert("Nemáte dostatek žetonů na odeslání zprávy. Koupíte si je v sekci 'Koupit žetony'.");
        return; // Zastavit odeslání zprávy
    }

    // Přidat zprávu do kontejneru
    const messageElement = document.createElement('div');
    messageElement.classList.add('chat-message');
    messageElement.textContent = message;
    messageContainer.appendChild(messageElement);

    tokenCount -= 50; // Odečíst 30 žetonů za odeslání zprávy
    updateTokenDisplay(); // Aktualizovat zobrazení počtu žetonů

    // Uložit zprávu do localStorage
    const messages = JSON.parse(localStorage.getItem("message") || "[]");
    messages.push(message);
    localStorage.setItem("message", JSON.stringify(messages));

    messageInput.value = ''; // Vymazat vstup pro zprávu
}

// Funkce pro načtení historie zpráv
function loadMessageHistory() {
    const messages = JSON.parse(localStorage.getItem("message") || "[]");
    const messageContainer = document.getElementById('message-container');
    messages.forEach(msg => {
        const messageElement = document.createElement('div');
        messageElement.classList.add('chat-message');
        messageElement.textContent = msg;
        messageContainer.appendChild(messageElement);
    });
}

// Funkce pro zakoupení žetonů
function buyTokens() {
    const tokenAmount = parseInt(document.getElementById('tokenAmount').value);

    if (tokenAmount < 500 || tokenAmount > 10000) {
        alert("Množství žetonů musí být mezi 500 a 10000.");
        return;
    }

    // Přidání žetonů po úspěšné platbě
    tokenCount += tokenAmount;
    alert(`Zakoupili jste ${tokenAmount} žetonů.`);
    updateTokenDisplay(); // Aktualizace zobrazení žetonů
    document.getElementById('paypalForm').submit(); // Odeslat formulář PayPal
}

// Načíst data při načtení stránky
window.onload = function() {
    displayProfile();
    loadMessageHistory();
};

// Přidání uživatelských dat do localStorage po registraci
document.getElementById('registrationForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;

    const userData = {
        username: username,
        tokens: tokenCount
    };
  localStorage.setItem("userData", JSON.stringify(userData));

    validateRegistration(event);
});

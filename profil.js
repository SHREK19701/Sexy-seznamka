function handleRegistration(event) {
    event.preventDefault();

    // Načteme hodnoty z formulářových polí
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const birthdate = document.getElementById('birthdate').value;
    const height = document.getElementById('height').value;
    const weight = document.getElementById('weight').value;
    const eyes = document.getElementById('eyes').value;
    const hair = document.getElementById('hair').value;
    const children = document.getElementById('children').value;
    const job = document.getElementById('job').value;
    const hobbies = document.getElementById('hobbies').value;
    const orientation = document.getElementById('orientation').value;
    const search = document.getElementById('search').value;

    // Uložíme data do localStorage
    const userProfile = {
        username,
        email,
        birthdate,
        height,
        weight,
        eyes,
        hair,
        children,
        job,
        hobbies,
        orientation,
        search
    };
    localStorage.setItem('userProfile', JSON.stringify(userProfile));

    alert('Registrace byla úspěšná!');
    window.location.href = 'přhlášení.html'; 
}


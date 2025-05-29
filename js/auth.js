// Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyACYdTx-sM9sNQ5a6jqD05oEcE-4n2o2TM",
    authDomain: "pingnec-f8d76.firebaseapp.com",
    projectId: "pingnec-f8d76",
    storageBucket: "pingnec-f8d76.firebasestorage.app",
    messagingSenderId: "677440746671",
    appId: "1:677440746671:web:1ef4837b5c385f7dc0d05a",
    measurementId: "G-X7C3CMZR2L"
  };

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Referencias a elementos del DOM
const loginModal = document.getElementById('loginModal');
const userDisplay = document.getElementById('userDisplay');
const loginButton = document.getElementById('loginButton');
const logoutButton = document.getElementById('logoutButton');

// Proveedor de autenticación de Google
const provider = new firebase.auth.GoogleAuthProvider();

// Función para iniciar sesión con Google
function signInWithGoogle() {
    firebase.auth().signInWithPopup(provider)
        .then((result) => {
            // El usuario ha iniciado sesión correctamente
            const user = result.user;
            saveUserToDatabase(user);
        }).catch((error) => {
            console.error("Error en el inicio de sesión:", error);
            alert("Error al iniciar sesión. Por favor, intenta de nuevo.");
        });
}

// Función para cerrar sesión
function signOut() {
    firebase.auth().signOut().then(() => {
        console.log('Sesión cerrada');
        updateUI(null);
    }).catch((error) => {
        console.error('Error al cerrar sesión:', error);
    });
}

// Función para guardar usuario en la base de datos
function saveUserToDatabase(user) {
    const userRef = firebase.database().ref('users/' + user.uid);
    const userData = {
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        lastLogin: new Date().toISOString()
    };
    userRef.set(userData);
}

// Función para actualizar la interfaz según el estado de autenticación
function updateUI(user) {
    if (user) {
        // Usuario está autenticado
        if (userDisplay) {
            userDisplay.innerHTML = `
                <img src="${user.photoURL}" alt="${user.displayName}" class="user-avatar">
                <span>${user.displayName}</span>
            `;
        }
        if (loginButton) loginButton.style.display = 'none';
        if (logoutButton) logoutButton.style.display = 'block';
        if (loginModal) {
            const modalInstance = bootstrap.Modal.getInstance(loginModal);
            if (modalInstance) modalInstance.hide();
        }
    } else {
        // Usuario no está autenticado
        if (userDisplay) userDisplay.innerHTML = '';
        if (loginButton) loginButton.style.display = 'block';
        if (logoutButton) logoutButton.style.display = 'none';
    }
}

// Observador del estado de autenticación
firebase.auth().onAuthStateChanged((user) => {
    updateUI(user);
});

// Event listeners
if (loginButton) {
    loginButton.addEventListener('click', signInWithGoogle);
}

if (logoutButton) {
    logoutButton.addEventListener('click', signOut);
} 
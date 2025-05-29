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
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

// Proveedor de autenticación de Google
const provider = new firebase.auth.GoogleAuthProvider();

// Función para iniciar sesión con Google
function signInWithGoogle() {
    firebase.auth().signInWithPopup(provider)
        .then((result) => {
            // El usuario ha iniciado sesión correctamente
            const user = result.user;
            saveUserToDatabase(user);
            closeLoginModal();
        }).catch((error) => {
            console.error("Error en el inicio de sesión:", error);
            showError("Error al iniciar sesión con Google. Por favor, intenta nuevamente.");
        });
}

// Función para registrar usuario con correo y contraseña
function registerWithEmail(email, password, name) {
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Actualizar el perfil del usuario con su nombre
            return userCredential.user.updateProfile({
                displayName: name
            }).then(() => {
                saveUserToDatabase(userCredential.user);
                closeLoginModal();
                showSuccess("¡Registro exitoso!");
            });
        })
        .catch((error) => {
            console.error("Error en el registro:", error);
            showError(getErrorMessage(error.code));
        });
}

// Función para iniciar sesión con correo y contraseña
function signInWithEmail(email, password) {
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            closeLoginModal();
            showSuccess("¡Inicio de sesión exitoso!");
        })
        .catch((error) => {
            console.error("Error en el inicio de sesión:", error);
            showError(getErrorMessage(error.code));
        });
}

// Función para cerrar sesión
function signOut() {
    firebase.auth().signOut().then(() => {
        console.log('Sesión cerrada');
        updateUI(null);
        showSuccess("Has cerrado sesión correctamente");
    }).catch((error) => {
        console.error('Error al cerrar sesión:', error);
        showError("Error al cerrar sesión");
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
                <img src="${user.photoURL || 'assets/img/default-avatar.png'}" alt="${user.displayName}" class="user-avatar">
                <span>${user.displayName}</span>
            `;
            userDisplay.style.display = 'flex';
        }
        if (loginButton) loginButton.style.display = 'none';
        if (logoutButton) logoutButton.style.display = 'block';
    } else {
        // Usuario no está autenticado
        if (userDisplay) {
            userDisplay.innerHTML = '';
            userDisplay.style.display = 'none';
        }
        if (loginButton) loginButton.style.display = 'block';
        if (logoutButton) logoutButton.style.display = 'none';
    }
}

// Función para mostrar mensajes de error
function showError(message) {
    // Aquí puedes implementar tu propia lógica para mostrar errores
    alert(message);
}

// Función para mostrar mensajes de éxito
function showSuccess(message) {
    // Aquí puedes implementar tu propia lógica para mostrar mensajes de éxito
    console.log(message);
}

// Función para cerrar el modal de login
function closeLoginModal() {
    const modal = bootstrap.Modal.getInstance(loginModal);
    if (modal) {
        modal.hide();
    }
}

// Función para obtener mensajes de error en español
function getErrorMessage(errorCode) {
    switch (errorCode) {
        case 'auth/email-already-in-use':
            return 'Este correo electrónico ya está registrado.';
        case 'auth/invalid-email':
            return 'El correo electrónico no es válido.';
        case 'auth/operation-not-allowed':
            return 'La operación no está permitida.';
        case 'auth/weak-password':
            return 'La contraseña es demasiado débil. Debe tener al menos 6 caracteres.';
        case 'auth/user-disabled':
            return 'Esta cuenta ha sido deshabilitada.';
        case 'auth/user-not-found':
            return 'No existe una cuenta con este correo electrónico.';
        case 'auth/wrong-password':
            return 'La contraseña es incorrecta.';
        default:
            return 'Ha ocurrido un error. Por favor, intenta nuevamente.';
    }
}

// Event Listeners
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        signInWithEmail(email, password);
    });
}

if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        registerWithEmail(email, password, name);
    });
}

if (logoutButton) {
    logoutButton.addEventListener('click', signOut);
}

// Observador del estado de autenticación
firebase.auth().onAuthStateChanged((user) => {
    updateUI(user);
}); 
// Obtener parámetro GET user_id
const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get("user_id");

// Referencias del DOM
const title = document.getElementById("title");
const img = document.getElementById("userImage");
const errorMsg = document.getElementById("errorMessage");
const validatedMsg = document.getElementById("validatedMessage");
const downloadBtn = document.getElementById("downloadBtn");

// Función para descargar la imagen
function downloadImage(url, filename) {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Si no hay parámetro user_id → mostrar error
if (!userId) {
    title.textContent = "❌ No se ha proporcionado user_id en la URL.";
    errorMsg.textContent = "Ejemplo: index.html?user_id=UUID";
    errorMsg.style.display = "block";
} else {
    // Cargar JSON
    fetch("data.json")
        .then(res => res.json())
        .then(data => {
            if (data[userId]) {
                const user = data[userId];

                // Mostrar mensaje Validado con animación
                validatedMsg.classList.add("show");

                // Después de un pequeño delay, mostrar la imagen suavemente
                setTimeout(() => {
                    img.src = "images/" + user.filename;
                    img.onload = () => img.classList.add("loaded");

                    // Mostrar botón de descarga
                    downloadBtn.style.display = "inline-block";
                    downloadBtn.onclick = () => downloadImage(img.src, user.filename);

                }, 100);

            } else {
                title.textContent = "❌ Usuario no encontrado";
                errorMsg.textContent = "No se encontró ninguna imagen para este ID.";
                errorMsg.style.display = "block";
            }

        })
        .catch(err => {
            title.textContent = "❌ Error cargando data.json";
            errorMsg.textContent = "Asegúrate de que data.json está accesible.";
            errorMsg.style.display = "block";
        });
}

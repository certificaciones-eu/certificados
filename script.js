// Obtener parámetro GET user_id
const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get("user_id");

// Referencias del DOM
const title = document.getElementById("title");
const img = document.getElementById("userImage");
const errorMsg = document.getElementById("errorMessage");
const validatedMsg = document.getElementById("validatedMessage");
const downloadBtn = document.getElementById("downloadBtn");
const imagePlaceholder = document.getElementById("imagePlaceholder");

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
    imagePlaceholder.innerHTML = '<i class="fas fa-exclamation-triangle"></i><p>Parámetro user_id no encontrado</p>';
} else {
    // Mostrar indicador de carga
    title.innerHTML = '<div class="loading"></div> Validando certificado...';
    
    // Cargar JSON
    fetch("data.json")
        .then(res => {
            if (!res.ok) {
                throw new Error("Error al cargar los datos");
            }
            return res.json();
        })
        .then(data => {
            if (data[userId]) {
                const user = data[userId];
                
                // Actualizar título
                title.textContent = "Certificado Verificado";
                title.className = "success";
                
                // Mostrar mensaje Validado
                validatedMsg.style.display = "flex";
                
                // Después de un pequeño delay, mostrar la imagen suavemente
                setTimeout(() => {
                    img.src = "images/" + user.filename;
                    img.onload = function() {
                        img.style.opacity = 1;
                        imagePlaceholder.style.display = "none";
                        
                        // Mostrar botón de descarga
                        downloadBtn.style.display = "inline-flex";
                        downloadBtn.onclick = () => downloadImage(img.src, user.filename);
                    };
                }, 1500);

            } else {
                title.textContent = "❌ Usuario no encontrado";
                title.className = "error";
                errorMsg.textContent = "No se encontró ningún certificado para este ID.";
                errorMsg.style.display = "block";
                imagePlaceholder.innerHTML = '<i class="fas fa-user-times"></i><p>Usuario no encontrado en la base de datos</p>';
            }
        })
        .catch(err => {
            title.textContent = "❌ Error cargando datos";
            title.className = "error";
            errorMsg.textContent = "Asegúrate de que data.json está accesible.";
            errorMsg.style.display = "block";
            imagePlaceholder.innerHTML = '<i class="fas fa-exclamation-circle"></i><p>Error al cargar los datos del certificado</p>';
        });
}
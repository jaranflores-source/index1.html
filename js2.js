let usuarios = JSON.parse(
    localStorage.getItem("usuariosDemo") || "[]"
);

let indiceEdicion = null;

const formulario = document.getElementById("formulario");
const tabla = document.getElementById("tablaUsuarios");
const btnGuardar = document.getElementById("btnGuardar");
const btnCancelar = document.getElementById("btnCancelar");

mostrarUsuarios();

formulario.addEventListener("submit", function(event) {
    event.preventDefault();

    let nombre = document.getElementById("nombre").value.trim();
    let clave = document.getElementById("clave").value;

    let existe = usuarios.some(function(usuario, idx) {
        return usuario.nombre.toLowerCase() === nombre.toLowerCase() && idx !== indiceEdicion;
    });

    if (existe) {
        alert("El nombre de usuario ya existe. Elige otro.");
        return;
    }

    if (indiceEdicion === null) {
        let nuevoUsuario = {
            nombre: nombre,
            clave: clave
        };
        usuarios.push(nuevoUsuario);
    } else {
        usuarios[indiceEdicion].nombre = nombre;
        usuarios[indiceEdicion].clave = clave;
        resetearFormularioEdicion();
    }

    guardarUsuarios();
    mostrarUsuarios();

    formulario.reset();
});

btnCancelar.addEventListener("click", function() {
    resetearFormularioEdicion();
    formulario.reset();
});

function guardarUsuarios() {
    localStorage.setItem(
        "usuariosDemo",
        JSON.stringify(usuarios)
    );
}

function mostrarUsuarios() {
    tabla.innerHTML = "";

    if (usuarios.length === 0) {
        let filaVacia = document.createElement("tr");
        let celdaVacia = document.createElement("td");
        celdaVacia.colSpan = 3;
        celdaVacia.style.textAlign = "center";
        celdaVacia.style.color = "#64748b";
        celdaVacia.textContent = "No hay usuarios registrados.";
        filaVacia.appendChild(celdaVacia);
        tabla.appendChild(filaVacia);
        return;
    }

    usuarios.forEach(function(usuario, indice) {
        let fila = document.createElement("tr");

        let celdaNombre = document.createElement("td");
        celdaNombre.textContent = usuario.nombre;

        let celdaClave = document.createElement("td");
        celdaClave.textContent = "••••••";

        let celdaAccion = document.createElement("td");
        celdaAccion.className = "actions-cell";

        let botonEditar = document.createElement("button");
        botonEditar.textContent = "Editar";
        botonEditar.className = "btn-warning";
        botonEditar.addEventListener("click", function() {
            cargarUsuarioParaEditar(indice);
        });

        let botonEliminar = document.createElement("button");
        botonEliminar.textContent = "Eliminar";
        botonEliminar.className = "btn-danger";
        botonEliminar.addEventListener("click", function() {
            eliminarUsuario(indice);
        });

        celdaAccion.appendChild(botonEditar);
        celdaAccion.appendChild(botonEliminar);
        fila.appendChild(celdaNombre);
        fila.appendChild(celdaClave);
        fila.appendChild(celdaAccion);

        tabla.appendChild(fila);
    });
}

function cargarUsuarioParaEditar(indice) {
    indiceEdicion = indice;
    document.getElementById("nombre").value = usuarios[indice].nombre;
    document.getElementById("clave").value = usuarios[indice].clave;
    
    btnGuardar.textContent = "Actualizar usuario";
    btnCancelar.style.display = "block";
}

function resetearFormularioEdicion() {
    indiceEdicion = null;
    btnGuardar.textContent = "Guardar usuario";
    btnCancelar.style.display = "none";
}

function eliminarUsuario(indice) {
    if (indiceEdicion === indice) {
        resetearFormularioEdicion();
        formulario.reset();
    }
    
    usuarios.splice(indice, 1);
    guardarUsuarios();
    mostrarUsuarios();
}
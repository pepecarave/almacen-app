// Inicializar la base de datos IndexedDB
let db;
const request = indexedDB.open("almacenDB", 1);

request.onupgradeneeded = function (event) {
    let db = event.target.result;
    let store = db.createObjectStore("productos", { keyPath: "id", autoIncrement: true });
    store.createIndex("nombre", "nombre", { unique: false });
};

request.onsuccess = function (event) {
    db = event.target.result;
    mostrarProductos();
};

request.onerror = function (event) {
    console.log("Error al abrir IndexedDB:", event.target.errorCode);
};

// Función para agregar un producto
function agregarProducto() {
    const nombre = document.getElementById("nombre").value;
    const ubicacion = document.getElementById("ubicacion").value;
    const stock = parseInt(document.getElementById("stock").value);

    if (!nombre || !ubicacion || isNaN(stock)) {
        alert("Por favor, completa todos los campos.");
        return;
    }

    const transaction = db.transaction(["productos"], "readwrite");
    const store = transaction.objectStore("productos");
    const producto = { nombre, ubicacion, stock };

    store.add(producto);
    transaction.oncomplete = () => {
        mostrarProductos();
        document.getElementById("nombre").value = "";
        document.getElementById("ubicacion").value = "";
        document.getElementById("stock").value = "";
    };
}
// Función para mostrar productos en la tabla
function mostrarProductos() {
    const transaction = db.transaction(["productos"], "readonly");
    const store = transaction.objectStore("productos");
    const request = store.getAll();

    request.onsuccess = function () {
        const productos = request.result;
        let tablaHTML = "";
        productos.forEach((p) => {
            tablaHTML += `
                <tr>
                    <td>${p.nombre}</td>
                    <td>${p.ubicacion}</td>
                    <td>${p.stock}</td>
                    <td>
                        <button onclick="eliminarProducto(${p.id})">Eliminar</button>
                    </td>
                </tr>
            `;
        });
        document.getElementById("lista-productos").innerHTML = tablaHTML;
    };
}

// Función para eliminar un producto por su ID correcto
function eliminarProducto(id) {
    const transaction = db.transaction(["productos"], "readwrite");
    const store = transaction.objectStore("productos");

    const request = store.delete(id);
    request.onsuccess = () => {
        mostrarProductos();
    };
    request.onerror = () => {
        console.log("Error al eliminar el producto.");
    };
}




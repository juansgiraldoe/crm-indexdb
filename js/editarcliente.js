(function () {
  let idCliente;

  const nombreInput = document.querySelector('#nombre');
  const correoInput = document.querySelector('#email');
  const telefonoInput = document.querySelector('#telefono');
  const empresaInput = document.querySelector('#empresa');
  const formulario = document.querySelector('#formulario');
  
  document.addEventListener('DOMContentLoaded', ()=>{
    conectarDB();

    //Verifica el id de la url.
    const parmetros = new URLSearchParams(window.location.search);
    idCliente = parmetros.get('id');

    if (idCliente) {
      setTimeout(() => {
        obtenerCliente(idCliente);
      }, 100);
    };

    //Actualiza el registro.
    formulario.addEventListener('submit', actualizarCliente)
  });

  function obtenerCliente(id) {
    const transaction = DB.transaction(['crm'], 'readwrite');
    const objectStore = transaction.objectStore('crm');
    const cliente = objectStore.openCursor();
    cliente.onsuccess = function(e) {
      const cursor = e.target.result; 
      if (cursor) {
        if (cursor.value.id === Number(id)) {
          llenarForm(cursor.value);
        };
        cursor.continue();
      };
    };
    
  };

  function conectarDB() {
    const abrirConexion = window.indexedDB.open('crm', 1);
    abrirConexion.onerror = function () {
      console.log('Hubo un error.');
    };

    abrirConexion.onsuccess = function () {
      DB = abrirConexion.result;
    };
  };

  function llenarForm(data) {
    const { nombre, correo, telefono, empresa } = data;
    nombreInput.value = nombre;
    correoInput.value = correo;
    telefonoInput.value = telefono;
    empresaInput.value = empresa;
  };

  function actualizarCliente(e) {
    e.preventDefault();
    if (nombreInput.value === '' || correoInput.value === '' || telefonoInput.value === '' || empresaInput.value === '') {
      imprimirAlerta('Todos los campos son obligatorios.', 'error');
      return;
    };
    //Actualizar cliente.
    const clienteActualizado = {
      nombre: nombreInput.value,
      correo: correoInput.value,
      telefono: telefonoInput.value,
      empresa: empresaInput.value,
      id: Number(idCliente),
    };
    
    const transaction = DB.transaction(['crm'], 'readwrite');
    const objectStore = transaction.objectStore('crm');
    objectStore.put(clienteActualizado);
    transaction.oncomplete = () => {
      imprimirAlerta('¡Cliente actualizado!');
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 3000);
    };
    transaction.onerror = () => {
      imprimirAlerta('Hubo un error.', 'error')
    };
  };

})();
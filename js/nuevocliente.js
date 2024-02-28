(function () {
  let DB;
  const formulario = document.querySelector('#formulario');

  window.onload = ()=> {
    conectarDB();
    formulario.addEventListener('submit', validarCliente)
  };

  function validarCliente(e) {
    e.preventDefault();

    //Leer todos los inputs.
    const nombre = document.querySelector('#nombre').value;
    const correo = document.querySelector('#email').value;
    const telefono = document.querySelector('#telefono').value;
    const empresa = document.querySelector('#empresa').value;

    if (nombre === '' || correo === '' || telefono === '' || empresa === '') {
      imprimirAlerta('Todos los campos son obligatorios.', 'error');
      return;
    };

    //Crear un objeto con la informacion del formulario.
    const cliente = {
      nombre,
      correo,
      telefono,
      empresa,
    };
    cliente.id = Date.now();

    crearCliente(cliente);
  };

  function crearCliente(cliente) {
    const transaction = DB.transaction(['crm'], 'readwrite');
    const objectStore = transaction.objectStore('crm');
    
    objectStore.add(cliente);
    transaction.onerror = function () {
      imprimirAlerta('Hubo un error. ⚠', 'error');
    };

    transaction.oncomplete = () => {
      imprimirAlerta('¡Cliente agregado! ✌🏻');
      formulario.reset();
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 3000);
    };

  }
})();
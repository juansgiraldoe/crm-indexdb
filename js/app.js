(function () {
  let DB;

  window.onload = () => {
    crearDB();
  };

  //Crear la base de datos en IndexDB.
  function crearDB() {

    const crearDB = window.indexedDB.open('crm', 1);

    crearDB.onerror = function () {
      console.log('Hubo un error.');
    };

    crearDB.onsuccess = function () {
      DB = crearDB.result;
    };

    crearDB.onupgradeneeded = function (e) {
      const db = e.target.result;
      const objectStore = db.createObjectStore('crm', {keyPath: 'id', autoIncrement: true,});
      objectStore.createIndex('nombre', 'nombre', {unique: false});
      objectStore.createIndex('correo', 'correo', {unique: true});
      objectStore.createIndex('telefono', 'telefono', {unique: false});
      objectStore.createIndex('empresa', 'empresa', {unique: false});
      objectStore.createIndex('id', 'id', {unique: true});
      console.log('Todo creado y listo.');
    };
    
  };
})();

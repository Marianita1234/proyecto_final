document.addEventListener('DOMContentLoaded', async function () {

    await obtenerPrendas();
    
    const savePrendaButton = document.getElementById('savePrendaButton');
    savePrendaButton.addEventListener('click', async function () {
        const imgURL = document.getElementById('imgURL').value;
        const nombrePrenda = document.getElementById('nombre').value;
        const marcaPrenda = document.getElementById('marca').value;
        const precioPrenda = document.getElementById('precio').value;
        const materialPrenda = document.getElementById('material').value;
        const stockPrenda = document.getElementById('stock').checked;

        if (validarCampos(imgURL, nombrePrenda, marcaPrenda, precioPrenda, materialPrenda)) {
            await guardarPrenda({ imgURL, nombrePrenda, marcaPrenda, precioPrenda, materialPrenda, stockPrenda });
            ocultarModal('crearPrendaModal');
            await obtenerPrendas();
        }
    });

    const actualizarPrendaButton = document.getElementById('actualizarPrendaButton');
    actualizarPrendaButton.addEventListener('click', async function () {
        const imgURLPrenda = document.getElementById('editarPrendaImgURL').value;
        const idPrenda = document.getElementById('editarPrendaID').innerHTML;
        const nombrePrenda = document.getElementById('editarPrendaNombre').value;
        const marcaPrenda = document.getElementById('editarPrendaMarca').value;
        const precioPrenda = document.getElementById('editarPrendaPrecio').value;
        const materialPrenda = document.getElementById('editarPrendaMaterial').value;
        const stockPrenda = document.getElementById('editarPrendaStock').checked;

        if (validarCampos(imgURLPrenda, nombrePrenda, marcaPrenda, precioPrenda, materialPrenda)) {
            await actualizarPrenda({ imgURLPrenda, idPrenda, nombrePrenda, marcaPrenda, precioPrenda, materialPrenda, stockPrenda });
            ocultarModal('editarPrendaModal');
            await obtenerPrendas();
        }
    });

    const deletePrendaButton = document.getElementById('deletePrendaButton');
    deletePrendaButton.addEventListener('click', async function () {
        const idPrenda = document.getElementById('eliminarPrendaID').innerHTML;
        await eliminarPrenda(idPrenda);
        ocultarModal('eliminarPrendaModal');
        await obtenerPrendas();
    });
});

function validarCampos(imgURL, nombrePrenda, marcaPrenda, precioPrenda, materialPrenda) {
    if (!imgURL || !nombrePrenda || !marcaPrenda || precioPrenda === "" || materialPrenda === "") {
        alert("Por favor, complete todos los campos obligatorios.");
        return false;
    }
    return true;
}

function mostrarPrendas(prendas) {
    let arrayPrendas = '';
    if (!!prendas && prendas.length > 0) {
        prendas.forEach(prenda => {
            arrayPrendas += `<tr>
                <td scope="row">${prenda.id}</td>
                <td><img src="${prenda.imgURL}" class="img-thumbnail" width="70" height="70"></td>
                <td>${prenda.nombre}</td>
                <td>${prenda.marca}</td>
                <td>${prenda.precio}</td>
                <td>${prenda.material}</td>
                <td>${prenda.stock}</td>
                <td>
                    <button type="button" class="btn btn-outline-info" onclick=
                    "verDetallePrenda('${prenda.id}')">
                        <i class="bi bi-eye"></i>
                    </button>
                </td>
                <td>
                    <button type="button" class="btn btn-outline-primary" onclick=
                    "editarPrenda('${prenda.id}','${prenda.imgURL}', '${prenda.nombre}', '${prenda.marca}', 
                    '${prenda.precio}','${prenda.material}','${prenda.stock}')">
                    <i class="fas fa-pencil-alt"></i>
                    </button>
                </td>
                <td>
                    <button type="button" class="btn btn-outline-danger" onclick=
                    "validarEliminarPrenda('${prenda.id}', '${prenda.nombre}')">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>`;
        });
    } else {
        arrayPrendas = `<tr class="table-warning">
            <td colspan="6" class="text-center">No hay prendas</td>
        </tr>`;
    }

    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = arrayPrendas;
}

async function obtenerPrendas() {
    try {
        let response = await fetch('http://localhost:3000/prendas');
        let data = await response.json();
        mostrarPrendas(data);
    } catch (error) {
        console.log(error);
        mostrarPrendas(null);
    }
}

async function guardarPrenda({ imgURL, nombrePrenda, marcaPrenda, precioPrenda, materialPrenda, stockPrenda }) {
    try {
        let response = await fetch('http://localhost:3000/prendas', {
            method: 'POST',
            headers: {
                "Content-Type": 'application/json'
            },
            body: JSON.stringify({
                imgURL: imgURL,
                nombre: nombrePrenda,
                marca: marcaPrenda,
                precio: precioPrenda,
                material: materialPrenda,
                stock: stockPrenda
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        } else {
            let data = await response.json();

            if (data.ok) {
                alert('Prenda creada exitosamente');
            } else {
                alert('Error al crear la prenda');
            }

            ocultarModal('crearPrendaModal');
        }
    } catch (error) {
        console.log(error);
        alert('Error al crear la prenda');
    }
}

async function actualizarPrenda({ idPrenda, imgURLPrenda, nombrePrenda, marcaPrenda, precioPrenda, materialPrenda, stockPrenda }) {
    try {
        let request = await fetch(`http://localhost:3000/prendas/${idPrenda}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                imgURL: imgURLPrenda,
                nombre: nombrePrenda,
                marca: marcaPrenda,
                precio: precioPrenda,
                material: materialPrenda,
                stock: stockPrenda
            })
        });
        const data = await request.json();

        if (data.ok) {
            alert('Prenda actualizada exitosamente');
        } else {
            alert('Error al actualizar la prenda');
        }
    } catch (error) {
        console.log(error);
        alert('Error al actualizar la prenda');
    }
}

function editarPrenda(id, imgURL, nombre, marca, precio, material, stock) {
    document.getElementById('editarPrendaID').innerHTML = id;
    document.getElementById('editarPrendaImgURL').value = imgURL;
    document.getElementById('editarPrendaNombre').value = nombre;
    document.getElementById('editarPrendaMarca').value = marca;
    document.getElementById('editarPrendaPrecio').value = precio;
    document.getElementById('editarPrendaMaterial').value = material;
    document.getElementById('editarPrendaStock').checked = stock;
    mostrarModal('editarPrendaModal');
}

async function verDetallePrenda(id) {
    try {
        let request = await fetch(`http://localhost:3000/prendas/${id}`, {
            method: 'GET'
        });
        let data = await request.json();
        if (data.ok) {
            mostrarPrenda(data.prenda);
            mostrarModal('verPrendaModal');
        } else {
            alert('Error al obtener la prenda');
        }
    } catch (error) {
        console.log(error);
        alert('Error al obtener la prenda');
    }
}

function mostrarPrenda(prenda) {
    const prendaContainer = document.getElementById('prenda-container');
    prendaContainer.innerHTML = `
        <div class="row">
            <div class="col-md-6">
                <div class="card mb-3" style="max-width: 440px;">
                    <div class="row g-0 h-100 w-100">
                        <div class="col-md-4">
                        <img src="${prenda.imgURL}" class="img-fluid rounded-start h-100 w-100" alt="${prenda.nombre}">
                        </div>
                        <div class="col-md-8">
                            <div class="card-body">
                                <h5 class="card-title">${prenda.nombre}</h5>
                                <p class="card-text">${prenda.marca}</p>
                                <p class="card-text"><small class="text-muted">${prenda.precio}</small></p>
                                <p class="card-text"><small class="text-muted">${prenda.material}</small></p>
                                <p class="card-text"><small class="text-muted">${prenda.stock}</small></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
}

function validarEliminarPrenda(id, nombre) {
    document.getElementById('deletePrendaID').innerHTML = id;
    document.getElementById('deleteNombreprenda').innerHTML = nombre;
    mostrarModal('eliminarPrendaModal');
}


async function eliminarPrenda(id) {
    try {
        let request = await fetch(`http://localhost:3000/prendas/${id}`, {
            'method': 'DELETE'
        });
        let data = await request.json();
        if (data.ok) {
            alert('Prenda eliminada exitosamente');
        } else {
            alert('Error al eliminar la prenda');
        }
    } catch (error) {
        console.log(error);
        alert('Error al eliminar la prenda');
    }
}

function mostrarModal(idModal) {
    const myModal = new bootstrap.Modal(`#${idModal}`, {
        keyboard: false
    });
    myModal.show();
}

function ocultarModal(modalId) {
    const existingModal = document.getElementById(modalId);
    const modal = bootstrap.Modal.getInstance(existingModal);
    modal.hide();
}

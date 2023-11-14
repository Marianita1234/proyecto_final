document.addEventListener('DOMContentLoaded', function () {
  fetch('http://localhost:3000/prendas')
      .then(response => response.json())
      .then(json => showPrendas(json))
      .catch(function (error) {
          console.log(error);
      });
});

function showPrendas(prendas) {
  let arrayPrendas = '';
  for (let i = 0; i < prendas.length; i += 2) {
      arrayPrendas += '<div class="row">';
      for (let j = 0; j < 2 && i + j < prendas.length; j++) {
          const prenda = prendas[i + j];
          arrayPrendas += `
              <div class="col-md-6">
                  <div class="card mb-3" style="max-width: 440px;">
                      <div class="row g-0">
                          <div class="col-md-4">
                              <img src="${prenda.imgURL}" class="img-fluid rounded-start h-100" alt="${prenda.nombre}">
                          </div>
                          <div class="col-md-8">
                              <div class="card-body">
                                  <h5 class="card-title">${prenda.nombre}</h5>
                                  <p class="card-text">${prenda.marca}</p>
                                  <p class="card-text">${prenda.precio}</p>
                                  <p class="card-text">${prenda.material}</p>
                                  <p class="card-text">${prenda.stock}</p>
                                  <a href="#" class="btn btn-primary">Comprar</a>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>`;
      }
      arrayPrendas += '</div>';
  }

  const prendasContainer = document.getElementById('prendas-container');
  prendasContainer.innerHTML = arrayPrendas;
}

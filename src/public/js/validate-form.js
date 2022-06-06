(function () {
	'use strict'

	// Obtener todos los elementos que tengan la clase needs-validation
	var forms = document.querySelectorAll('.needs-validation')

	// Loop over them and prevent submission
	// Bucle que recorre todos los formularios y evita el comportamiendo por defecto
	Array.prototype.slice.call(forms)
		.forEach(function (form) {
			form.addEventListener('submit', function (event) {
				if (!form.checkValidity()) {
					event.preventDefault()
					event.stopPropagation()
				}

				form.classList.add('was-validated')
			}, false)
		})
})()
const txt_nombres = document.getElementById("nombres");
const txt_apellidos = document.getElementById("apellidos");
const txt_codigo = document.getElementById("codigo");
const select_programa = document.getElementById("programa");
const txt_correo = document.getElementById("correo");
const txt_fecha_nacimiento = document.getElementById("fecha-nacimiento");
const radio_genero = document.getElementsByName("genero");
const check_hobbies = document.getElementsByName("hobbies");
const btn_registrar = document.getElementById("registrar");

const table_estudiantes = document.getElementById("tabla-estudiantes");
const body_table_estudiantes = document.getElementById("tabla-estudiantes-body");

const div_correo = document.getElementById("div-email");

const alert = document.getElementById("myAlert");

let estudiantes = new Array();


class Estudiante{
	constructor(nombres, apellidos, codigo, correo, fecha, programa, genero, hobbies){
		this.nombres = nombres;
		this.apellidos = apellidos;
		this.codigo = codigo;
		this.correo = correo;
		this.fecha = fecha;
		this.programa = programa;
		this.genero = genero;
		this.hobbies = hobbies;
	}
}

let var_nombres;
let var_apellidos;
let var_codigo;
let var_correo;
let var_fecha_nacimiento;
let var_programa;
let var_genero;
let arr_hobbies = [];

let estado_formulario = "Registrar"; 
let i_editando;
let estudiante_editando;



function validarDatos(){
	arr_hobbies = [];
	var_nombres = txt_nombres.value;
	var_apellidos = txt_apellidos.value;
	var_codigo = txt_codigo.value;
	var_correo = generarCorreo();
	var_fecha_nacimiento = txt_fecha_nacimiento.value;
	var_programa = select_programa[select_programa.selectedIndex].text;
	radio_genero.forEach(elemento => elemento.checked ? var_genero = elemento.value : null);
	check_hobbies.forEach(elemento => elemento.checked ? arr_hobbies.push(elemento.value) : null);

	if (estado_formulario == "Editar" && txt_correo.value == "") {
		mostrarError();
		return false;
	}

	if (arr_hobbies.length > 0 && var_nombres != "" && var_apellidos != "" && var_codigo != "" && var_correo != "" && var_fecha_nacimiento && var_genero != "" && arr_hobbies.length != 0) {
		ocultarError();
		return true;
	}else{
		mostrarError();
		return false;
	}

}


function generarCorreo(){
	let correo = "";
	let arrayNombres = var_nombres.split(" ");
	let arrayApellidos = var_apellidos.split(" ");
	if(arrayNombres.length > 1){
		correo = arrayNombres[0][0] + arrayNombres[1][0];
	}else{
		correo = arrayNombres[0][0];
	}
	correo += arrayApellidos[0];
	for(let i = var_codigo.length-1; i > var_codigo.length-3; i--){
		correo += var_codigo[i];
	}
	correo += "@ucatolica.edu.co";
	correo = correo.toLowerCase();
	return correo;
}

function varciarCampos(){
	txt_nombres.value = "";
	txt_apellidos.value = "";
	txt_codigo.value = "";
	txt_correo.value = "";
	select_programa.selectedIndex = 0;
	txt_fecha_nacimiento.value = "";
	radio_genero.forEach(elemento => elemento.checked = false);
	check_hobbies.forEach(elemento => elemento.checked = false);
}

function addEstudianteToArray(){
	if(validarDatos()){
		let estudiante = new Estudiante(var_nombres, var_apellidos, var_codigo, var_correo,var_fecha_nacimiento, var_programa, var_genero, arr_hobbies);
		estudiantes.push(estudiante);
	}

}

function estudiantesAarrayToTable(){
	vaciarTabla();
	varciarCampos();
	for (var i = 0; i < estudiantes.length; i++) {
		let row = "<tr><td>" + 
		estudiantes[i].nombres + 
		"</td><td>" + 
		estudiantes[i].apellidos + 
		"</td><td>" + 
		estudiantes[i].codigo + 
		"</td><td>" + 
		estudiantes[i].correo + 
		"</td><td>" +
		estudiantes[i].fecha + 
		"</td><td>" + 
		estudiantes[i].programa + 
		"</td><td>" +
		estudiantes[i].genero + 
		"</td><td>" + 
		estudiantes[i].hobbies + 
		"</td><td class='d-flex'><button id='editar-" + estudiantes[i].codigo  + "' class='mx-2 my-2 text-warning btn btn-outline-primary editar'><i class='bi bi-pencil-fill'></i></button><button id='eliminar-" + estudiantes[i].codigo  + "' class='mx-2 my-2 text-danger btn btn-outline-primary borrar'><i class='bi bi-trash-fill'></i></button></td></tr>";
		body_table_estudiantes.insertRow(-1).innerHTML = row;


		let boton_eliminar = document.getElementById("eliminar-" + estudiantes[i].codigo);
		boton_eliminar.addEventListener("click", eliminar);

		let boton_editar = document.getElementById("editar-" + estudiantes[i].codigo);
		boton_editar.addEventListener("click", editar);

	}

}

function vaciarTabla(){
	while(body_table_estudiantes.children.length != 0){
		body_table_estudiantes.removeChild(body_table_estudiantes.children[0]);
	}
}

function getCodigoFromRow(e) {
	return e.srcElement.parentElement.parentElement.children[2].textContent;
}

function getEstudianteByCodigo(codigo){
	for(i in estudiantes){
		if (estudiantes[i].codigo == codigo) {
			return [i, estudiantes[i]];
		}
	}
	return null;
}

function eliminar(e){
	ocultarError();
	let codigo = getCodigoFromRow(e);
	let estudiante = getEstudianteByCodigo(codigo);
	if (estudiante != null) {
		estudiantes = estudiantes.filter(est => est.codigo != estudiante[1].codigo);
	}
	estudiantesAarrayToTable();
} 

function editar(e){
	ocultarError();
	let codigo = getCodigoFromRow(e);
	let estudiante = getEstudianteByCodigo(codigo);
	i_editando = estudiante[0];
	estudiante_editando = estudiante[1];
	if (estudiante =! null) {
		txt_nombres.value = estudiante_editando.nombres;
		txt_apellidos.value = estudiante_editando.apellidos;
		txt_codigo.value = estudiante_editando.codigo;
		txt_fecha_nacimiento.value = estudiante_editando.fecha;
		div_correo.classList.remove("d-none");
		txt_correo.value = estudiante_editando.correo;
		for (i in select_programa.options){
			if (select_programa[i].text == estudiante_editando.programa) {
				select_programa.selectedIndex=i;
			}
		}	
		radio_genero.forEach(elemento => elemento.value == estudiante_editando.genero ? elemento.checked = true : null);
		for (i in estudiante_editando.hobbies){
			check_hobbies.forEach(elemento => elemento.value == estudiante_editando.hobbies[i] ? elemento.checked = true : null);
		}
		estado_formulario = "Editar";
		btn_registrar.textContent = "Guardar";
	}

}

function guardar() {
	var_correo = txt_correo.value;
	for(i in estudiantes){
		if (i == i_editando) {
			estudiantes[i].nombres = var_nombres;
			estudiantes[i].apellidos = var_apellidos;
			estudiantes[i].codigo = var_codigo;
			estudiantes[i].correo = var_correo;
			estudiantes[i].fecha = var_fecha_nacimiento;
			estudiantes[i].programa = var_programa;
			estudiantes[i].genero = var_genero;
			estudiantes[i].hobbies = arr_hobbies;
			
		}
	}

	
	

}


btn_registrar.onclick = function(){
	if (validarDatos()){
		if (estado_formulario == "Registrar") {
			addEstudianteToArray();
			estudiantesAarrayToTable();
		}else if (estado_formulario == "Editar") {
			guardar();
			div_correo.classList.add("d-none");
			estado_formulario = "Registrar";
			btn_registrar.textContent = "Registrar";
			estudiantesAarrayToTable();
			
		}
	}

	
};

function mostrarError(){
	alert.classList.remove("d-none");

}
function ocultarError(){
	alert.classList.add("d-none");
}
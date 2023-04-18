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




import Estudiante from "./Estudiante.js"
import EstudianteDAO from "./EstudianteDAO.js"


const estudianteDAO = new EstudianteDAO();

let var_nombres;
let var_apellidos;
let var_codigo;
let var_correo;
let var_fecha_nacimiento;
let var_programa;
let var_genero;
let arr_hobbies = [];

let estado_formulario = "Registrar";

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
	if (arr_hobbies.length > 0 && var_nombres != "" && var_apellidos != "" && var_codigo != "" && var_correo != "" && var_fecha_nacimiento && var_programa != "Seleccione" && var_genero != undefined && arr_hobbies.length != 0) {
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
	let estudiante = new Estudiante(var_nombres, var_apellidos, var_codigo, var_correo,var_fecha_nacimiento, var_programa, var_genero, arr_hobbies);
	estudianteDAO.create(estudiante);
}

function estudiantesAarrayToTable(){
	for (let i = 0; i < estudianteDAO.read().length; i++) {
		let row = "<tr><td>" + 
		estudianteDAO.read()[i].nombres + 
		"</td><td>" + 
		estudianteDAO.read()[i].apellidos + 
		"</td><td>" + 
		estudianteDAO.read()[i].codigo + 
		"</td><td>" + 
		estudianteDAO.read()[i].correo + 
		"</td><td>" +
		estudianteDAO.read()[i].fecha + 
		"</td><td>" + 
		estudianteDAO.read()[i].programa + 
		"</td><td>" +
		estudianteDAO.read()[i].genero + 
		"</td><td>" + 
		estudianteDAO.read()[i].hobbies + 
		"</td><td class='d-flex'><button id='editar-" + estudianteDAO.read()[i].codigo  + "' class='mx-2 my-2 text-warning btn btn-outline-primary editar'><i class='bi bi-pencil-fill'></i></button><button id='eliminar-" + estudianteDAO.read()[i].codigo  + "' class='mx-2 my-2 text-danger btn btn-outline-primary borrar'><i class='bi bi-trash-fill'></i></button></td></tr>";
		body_table_estudiantes.insertRow(-1).innerHTML = row;


		let boton_eliminar = document.getElementById("eliminar-" + estudianteDAO.read()[i].codigo);
		boton_eliminar.addEventListener("click", eliminar);

		let boton_editar = document.getElementById("editar-" + estudianteDAO.read()[i].codigo);
		boton_editar.addEventListener("click", editar);

	}

}

function vaciarTabla(){
	while(body_table_estudiantes.children.length != 0){
		body_table_estudiantes.removeChild(body_table_estudiantes.children[0]);
	}
}

function getCodigoFromRow(e) {
	let text = e.srcElement.parentElement.parentElement.children[2];
	console.log(text);
	console.log(text.textContent);
	return text.textContent;
}

function eliminar(e){
	ocultarError();
	let codigo = getCodigoFromRow(e);
	let estudiante = estudianteDAO.get(codigo);
	if (estudiante != null) {
		estudianteDAO.delete(codigo);
	}
	vaciarTabla();
	estudiantesAarrayToTable();
} 

function editar(e){
	ocultarError();
	let codigo = getCodigoFromRow(e);
	let estudiante =  estudianteDAO.get(codigo);
	if (estudiante =! null) {
		estudiante = estudianteDAO.get(codigo);
		txt_nombres.value =  estudiante.nombres;
		txt_apellidos.value = estudiante.apellidos;
		txt_codigo.value = estudiante.codigo;
		txt_fecha_nacimiento.value = estudiante.fecha;
		div_correo.classList.remove("d-none");
		txt_codigo.disabled = true;
		txt_correo.value = estudiante.correo;
		for (let i in select_programa.options){
			if (select_programa[i].text == estudiante.programa) {
				select_programa.selectedIndex=i;
			}
		}	
		radio_genero.forEach(elemento => elemento.value == estudiante.genero ? elemento.checked = true : null);
		for (let i in estudiante.hobbies){
			check_hobbies.forEach(elemento => elemento.value == estudiante.hobbies[i] ? elemento.checked = true : null);
		}
		estado_formulario = "Editar";
		btn_registrar.textContent = "Guardar";
	}

}

function guardar() {
	var_correo = txt_correo.value;
	let estudiante = new Estudiante(var_nombres, var_apellidos, var_codigo, var_correo,var_fecha_nacimiento, var_programa, var_genero, arr_hobbies);
	estudianteDAO.update(estudiante);
	

}


btn_registrar.onclick = function(){
	if (validarDatos()){
		if (estado_formulario == "Registrar") {
			addEstudianteToArray();
			vaciarTabla();
			estudiantesAarrayToTable();
			varciarCampos();
		}else if (estado_formulario == "Editar") {
			guardar();
			vaciarTabla();
			estudiantesAarrayToTable();
			varciarCampos();
			txt_codigo.ena
			div_correo.classList.add("d-none");
			txt_codigo.disabled = false;
			estado_formulario = "Registrar";
			btn_registrar.textContent = "Registrar";

			
		}
	}

	
};

function mostrarError(){
	alert.classList.remove("d-none");

}
function ocultarError(){
	alert.classList.add("d-none");
}
export default class EstudianteDAO{
	constructor(){
		this.estudiantes = [];
	}
	create(estudiante){
		this.estudiantes.push(estudiante);
	}
	read(){
		return this.estudiantes;
	}
	update(estudiante){
		for (var i = 0; i < this.estudiantes.length; i++) {	
			if (this.estudiantes[i].codigo == estudiante.codigo) {
				this.estudiantes[i] = estudiante;
			}
		}
	}
	get(codigo){
		for (let i = 0; i < this.estudiantes.length; i++){
			if (this.estudiantes[i].codigo == codigo) {
				return this.estudiantes[i];
			}
		}
		return null;
	}
	delete(codigo){
		let estudiante = this.get(codigo);
		this.estudiantes = this.estudiantes.filter(est => est.codigo != estudiante.codigo);
	}
}

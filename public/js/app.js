/*
 * app.js -Gestion numérique d'élèves 
*/

var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var StudentManager = React.createClass({
	getInitialState: function(){
		return {data: []};
	},
	
	getRemoteStudents: function(){
		var studentManager_O = this;
		$.ajax({
			url:this.props.url,
			dataType: 'json',
		}).done(function (data){
			//console.log(data);
	        studentManager_O.setState({data: data});
		}).fail(function(data){
			console.error("Echec au chargement des élèves");
		});
	},

	addStudent: function(student){
		//console.log(student);
		var studentManager_O = this;
		var students = this.state.data;
		students.push(student);
		this.setState({data:students}, function(){

			$.ajax({
				url:this.props.url,
				datayType:'json',
				type:'POST',
				data:student})
			.done(function(data){
				studentManager_O.setState({data:data});
			})
			.fail(function(xhr,status,err){
				console.error(studentManager_O.props.url, status, err.toString());
			});

		});

	},

	managerDeleteStudent: function(student){
		var studentManager_O = this;
		var students = this.props.data;
		$.ajax({

			url:this.props.url,
			dataType:'json',
			type:'DELETE',
			data:{index:student}
		}).done(function(data){
			studentManager_O.setState({data:data})
		}).fail(function(hrx,status, err){
			console.error(studentManager_O.props.url, status, err.toString());
		});

	},
	
	componentDidMount: function(){
		this.getRemoteStudents();
	},
	
	render: function(){
		return (
			<div className="students">
				<h1>Elèves</h1>
				<StudentList deleteStudent={this.managerDeleteStudent} data={this.state.data}/>
				<StudentForm managerNewStudent={this.addStudent} />
				
			</div>
		);
	}
	
});

var Student = React.createClass({

	deleteStudent: function(e){

		//console.log(this);
		e.preventDefault();

		return this.props.onDelete(this.props.index);
	},

	render: function(){
		//console.log(this.props);
		return (
			<tr className="student-item">
				<td >{this.props.student.fname}</td>
				<td >{this.props.student.lname}</td>
				<td ><a onClick={this.deleteStudent} href="#" title="Supprimer"><i className="fa fa-trash-o fa-lg"></i></a></td>
				/*{this.props.children}{' '}<a onClick={this.deleteStudent} href="#"><i className="fa fa-remove"></i></a>*/
			</tr>
		);
	}

});

var StudentForm = React.createClass({
	addStudent: function(e){
		e.preventDefault();
		var fname=this.refs.fname.getDOMNode().value.trim();
		var lname=this.refs.lname.getDOMNode().value.trim();
		if (lname.length < 1 || fname.length < 1) return 0 ;
		
		
		this.props.managerNewStudent({fname:fname,lname:lname});

		this.refs.fname.getDOMNode().value = '';
		this.refs.lname.getDOMNode().value = '';
		
	},
	render: function(){
		return (
			<form className="students-form" onSubmit={this.addStudent}>
				<h2>Ajouter un élève</h2>
				<input type="text" placeholder="Prénom" name="fname" ref="fname" className="student-form-input"/><br/>
				<input type="text" placeholder="Nom" name="lname" ref="lname" className="student-form-input"/><br/>
				<input type="submit" value="Ajouter élève" className="student-form-submit"/> 
			</form>
		);
	}
});

var StudentList = React.createClass({

	handleDelete: function(id){
		return this.props.deleteStudent(id);
	},

	render: function(){	
		var StudentItem = this.props.data.map(function(student,index){
			return (
				<Student onDelete={this.handleDelete} index={index} key={index} student={student}/>
			);
		}.bind(this));
		return (
			/*<ul className="students-list">
				{StudentItem}
			</ul>*/
			<table>
				<thead>
					<tr>
						<th className="table-info">Prénom</th>
						<th className="table-info">Nom</th>
						<th className="table-options">Action</th>
					</tr>
				</thead>
				<ReactCSSTransitionGroup transitionName="student-row" component="tbody">
					{StudentItem}
				</ReactCSSTransitionGroup>
			</table>
		);
	}
});

React.render(
	<StudentManager url="/students.json" />,
	document.getElementById('content')
);

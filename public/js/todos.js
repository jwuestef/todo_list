window.onload=function(){
     $(function(){
         if(window.location.protocol==="https:")
             window.location.protocol="http";
     });
 }
 

function addTodo(task, completed, id){
	if(completed === "false"){
		$("#todo-list").append("<li id='" + id + "'>" + task + "<span><i class='fa fa-trash' aria-hidden='true'></i></span></li>");
	} else {
		$("#todo-list").append("<li id='" + id + "' class='done'>" + task + "<span><i class='fa fa-trash' aria-hidden='true'></i></span></li>");
	}
};




$(document).ready(function() {


	// clicking on the + sign will show the Add New Todo
	$(".fa-plus").click(function() {
		$("input[type='text']").slideToggle();
	});



	$.ajax({
		type: "GET",
		url: "http://rest.learncode.academy/api/todolist/todo"
	}).done(function(returnedTodos) {   //if ajax call finishes successfully
		console.log("ajax GET request succeeded");
		$.each(returnedTodos, function(i, todo){
			addTodo(todo.task, todo.completed, todo.id);
		});
	}).fail(function(){   //if the ajax call fails to finish for some reason.
		alert("The ajax call messed up.");
	});



	// hitting {enter} will submit the new todo
	$("input[type='text']").keypress(function(event) {
		if (event.which === 13) {
			var todoText = $("input[type='text']").val();
			$.ajax({
				type: "POST",
				url: "http://rest.learncode.academy/api/todolist/todo",
				data: {
					task: todoText,
					completed: false
				}
			}).done(function(data){
				console.log("ajax POST succeeded");
				$("ul").append("<li id='" + data.id + "'><span><i class='fa fa-trash' aria-hidden='true'></i></span> " + data.task + "</li>");
				$("input[type='text']").val("");
			}).fail(function(){
				alert("ajax POST failed.");
			});
		}
	});



	//check off specific todos by clicking
	$("ul").on("click", "li", function() {      //makes it future-li proof
	
		event.stopPropagation();     //Will stop "higher" event listeners from firing
									 //Without this, clickng will also cause it to fire the li click listener too, and any other listeners higher in the HTML, such as on the ul, body, or html tags

		var $newli = $(this).closest("li");

		if($newli.hasClass("done")){
			var newCompleted = "false";
		} else {
			var newCompleted = "true";
		}

		var updatedData = {
			task: $newli.text(),
			completed: newCompleted,
			id: $newli.attr("id")
		}

		$.ajax({
			type: "PUT",
			url: "http://rest.learncode.academy/api/todolist/todo/" + $newli.attr("id"),
			data: updatedData
		}).done(function(){
			console.log("ajax PUT call succeeded");
			$newli.toggleClass("done");
		}).fail(function(){
			alert("ajax PUT failed")
		});


	});




	//click on X to delete todo
	$("ul").on("click", "span", function(event) {   //makes it future-li proof

		event.stopPropagation();     //Will stop "higher" event listeners from firing
									 //Without this, clickng will also cause it to fire the li click listener too, and any other listeners higher in the HTML, such as on the ul, body, or html tags

		var $li = $(this).closest("li");

		$.ajax({
			type: "DELETE",
			url: "http://rest.learncode.academy/api/todolist/todo/" + $li.attr("id")
		}).done(function(){
			console.log("ajax DELETE call succeeded")
			$li.fadeOut(300, function() {
				$(this).remove();
			});
		}).fail(function(){
			alert("ajax DELETE failed")
		});

	}); 









});


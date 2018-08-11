$(function() {

	function ToLogin(){

	};

    $('#login-form-link').click(function(e) {
		$("#login-form").delay(100).fadeIn(100);
 		$("#register-form").fadeOut(100);
		$('#register-form-link').removeClass('active');
		$(this).addClass('active');
		e.preventDefault();
	});
	$('#register-form-link').click(function(e) {
		$("#register-form").delay(100).fadeIn(100);
 		$("#login-form").fadeOut(100);
		$('#login-form-link').removeClass('active');
		$(this).addClass('active');
		e.preventDefault();
	});


	$('#register-submit').click(function(e) {
		var username =$('#username_register').val();
		var name =$('#name_register').val();
		var email =$('#email_register').val();
		var password =$('#password_register').val();
		//validate
			$.ajax({
				type: 'post',
				url: 'http://localhost:8089/users',
				data: JSON.stringify({name:name,username:username,email:email,password:password}),
				contentType: "application/json; charset=utf-8",
				//dataType: "json",
				crossDomain: true,
				success: function (msg) {	
					alert('User created successfully');					
					$("#login-form").delay(100).fadeIn(100);
					$("#register-form").fadeOut(100);
				   $('#register-form-link').removeClass('active');
				   $(this).addClass('active');				
				},
				error: function (request, status, error) {
						alert('An error has occurred');
				}
			});

	});



	$('#login-submit').click(function(e) {
		var email =$('#email_login').val();
		var password =$('#password_login').val();
		$.ajax({
			type: 'post',
			url: 'http://localhost:8089/login',
			data: JSON.stringify({email:email,password:password}),
			contentType: "application/json; charset=utf-8",
			//dataType: "json",
			crossDomain: true,
			success: function (msg) {
				var token = jQuery.parseJSON(JSON.stringify(msg)).api_token;

				$("#view-form").delay(100).fadeIn(100);
				$("#login-form").fadeOut(100);
				$('#options').hide();
				$('.panel-login').hide();
			   $('#login-form-link').removeClass('active');
			   $(this).addClass('active');	

			   		$.ajax({
					type: 'get',
					url: 'http://localhost:8089/users',
					headers: {
						
						api_token:token
					},
					contentType: "application/json; charset=utf-8",
					//dataType: "json",
					crossDomain: true,
					success: function (msg) {
						//alert(msg);
						var list = jQuery.parseJSON(JSON.stringify(msg));
						/*var array = $.map(list, function(value, index) {
							return [value];
						});*/
                          for (var i=0; i<list.length;i++){
							$('#tablebody').append("<tr> <td>"+list[i].name+"</td> <td>"+list[i].username+"</td> <td>"+list[i].email+"</td> <td><i  id='update-"+list[i].email+"' class='fas fa-user-edit updateuser' style='cursor: pointer;'></i></td> <td><i  id='delete-"+list[i].id+"' class='far fa-trash-alt' style='cursor: pointer;'></i></td></tr>");
						  }
				          $(document).ready( function () {
							$('#myTable').DataTable();
						} );

						$('i[id^="update-"]').click(function(e) {
							var email = $(this).attr('id').split('-')[1];
							$.ajax({
								type: 'POST',
								url: 'http://localhost:8089/select',
								headers: {
									api_token:token
								},
								data: JSON.stringify({email:email}),
								contentType: "application/json; charset=utf-8",
								//dataType: "json",
								crossDomain: true,
								success: function (msg) {
									$("#update-form").delay(100).fadeIn(100);
									$("#view-form").fadeOut(100);
									$('#options').hide();
									$('.panel-login').hide();
								   $('#view-form-link').removeClass('active');
								   $(this).addClass('active');	

								   var list = jQuery.parseJSON(JSON.stringify(msg));
								   $('#name_update').val(list.name);
								   $('#username_update').val(list.username);
								   $('#email_update').val(list.email);
								   var idupdate = list.id;

								   $('#back-submit').click(function() {
									$("#view-form").delay(100).fadeIn(100);
									$("#update-form").fadeOut(100);
									$('#options').hide();
									$('.panel-login').hide();
								   $('#update-form-link').removeClass('active');
								   $(this).addClass('active');	


								   });

								   
								   $('#update-submit').click(function() {
									$.ajax({
										type: 'PUT',
										url: 'http://localhost:8089/alter',
										headers: {
											api_token:token
										},
										
										data: JSON.stringify({id:idupdate,name:$('#name_update').val(),username: $('#username_update').val(),email: $('#email_update').val()}),
										contentType: "application/json; charset=utf-8",
										//dataType: "json",
										crossDomain: true,
										success: function (msg) {						
											alert('User updated successfully')
											location.reload();	
										},
										error: function (request, status, error) {
												alert('An error has occurred');
										}
										
									});

									   
								});
									
								},
								error: function (request, status, error) {
										alert('Please check user and password');
								}
								
							});
						});

						$('i[id^="delete-"]').click(function(e) {
							var ans = confirm('Are you sure you want to delete this user?')
							if(ans==true){
							var id = $(this).attr('id').split('-')[1];
							$.ajax({
								type: 'DELETE',
								url: 'http://localhost:8089/delete',
								headers: {
									api_token:token
								},
								data: JSON.stringify({id:id}),
								contentType: "application/json; charset=utf-8",
								//dataType: "json",
								crossDomain: true,
								success: function (msg) {						
									alert(msg)	
									location.reload();	
									
								},
								error: function (request, status, error) {
										alert('An error has occurred');
								}
								
							});
							
						}
						});
					
					},
					error: function (request, status, error) {
							alert(status);
					}
					});		
			},
			error: function (request, status, error) {
					alert(status);
			}
			
		});

	});


	

});

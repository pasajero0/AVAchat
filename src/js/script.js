$('#mobile-sidebar').on('click', () => {
	if ($('#mobile-sidebar').hasClass('page-head__button_pushed')) {
		$("#mobile-sidebar_drop").animate({
			width: 'hide'
		},{
			duration: 200, 
			specialEasing: { 
				width: 'swing'
			}
		});
		$('#mobile-sidebar_drop').removeClass('main__sidebar_visibility');
		$('#mobile-sidebar').removeClass('page-head__button_pushed');
	}else{
		$("#mobile-sidebar_drop").animate({
		    width: 'show'
		},{
		    duration: 200, 
		    specialEasing: {
		      	width: 'swing'
		    }
		});
		$('#mobile-sidebar_drop').addClass('main__sidebar_visibility');
		$('#mobile-sidebar').addClass('page-head__button_pushed');
	}
});

$('#mobile-sidebar_drop').on('click', 'div',(event) => {
	let element = event.currentTarget; 
	if ($(element).hasClass('active')) {
		$(element).removeClass('active');
	}else{
		$('.main__section').removeClass('active');
		$(element).addClass('active');
	}
});

////////////////////////////////////////////////////////////////////////////////////////client
const socket = io();
$('form').submit(()=>{
    socket.emit('chat message', $('#m').val());
    $('#m').val('');
    return false;
});

$('#setNickname').submit( () => {
	socket.emit('new user', $('#nickname').val(), (data) => {
		if(data){
			$('#registration-form').hide();
		}else{
			alert('That username is already taken! Try another.');
		}
	})
	$('#nickname').val('');
});

socket.on('chat message', (msg, nick) => {
	if (nick === null){
		$('#messages').append('<p>New user connected!</p');
	}else{
  		$('#messages').append('<p><strong>'+nick+':</strong> '+msg+'</p');
  		console.log(msg);
	}
});


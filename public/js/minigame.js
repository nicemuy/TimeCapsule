	var temp = 0;

	var sPlayer = new Player();
	var sMap = new Map();
	var sChat = new Chat();
	var splayerList = new Array();


	var socket = io.connect('http://localhost:3000/');

	sPlayer.init();
	sMap.init();
	//splayerList.init();

	socket.on('init', function (data) {
    	sMap.set_Arr(data.map);
 		socket.emit('hello', { object : sPlayer.name });
  	});

  	socket.on('welcome', function (data){
  		alert("data.p_name = "+data.object );
  		splayerList.push(sPlayer);
  		alert("qqqq = "+splayerList.toString());
  		alert("name = "+splayerList[0].name);
  		//alert("wwww ");
  	});

	socket.on('move_react', function (data) {
    	console.log(data.direction,data.state);
    	sPlayer.set_direction(data.direction);
        sPlayer.set_state(data.state);
  	});

	socket.on('attack_react', function (data) {
    	console.log(data.direction,data.state);
    	sPlayer.set_direction(data.direction);
        sPlayer.set_state(data.state);
  	});

  	socket.on('chat_react', function (data) {
    	console.log(data.clength,data.message);
        sPlayer.set_clength(data.clength);
        sPlayer.set_message(data.message);

  	});

  	socket.on('hit_react', function (data) {
    	console.log(data.c_map);
        sMap.set_Arr(data.c_map);
  	});

	window.addEventListener('load',eventWindowLoaded,false);
	window.addEventListener('keydown', moveKey, true);
	window.addEventListener('keyup', hitKey, true);

	function eventWindowLoaded() {
		canvasApp();
	}
	
	function moveKey(evt) {

        switch (evt.keyCode) {

            // Left arrow.
        	case 37:

          		socket.emit('move', { p_name: sPlayer.name, p_state: 'Left' });
        		break;

            // Right arrow.
        	case 39:

          		socket.emit('move', { p_name: sPlayer.name, p_state: 'Right' });
          		break;

            // Down arrow
        	case 40:

          		socket.emit('move', { p_name: sPlayer.name, p_state: 'Down' });
          		break;

            // Up arrow 
        	case 38:

          		socket.emit('move', { p_name: sPlayer.name, p_state: 'Up' });
        		break;

      	}
    }

    function hitKey(evt) {

        switch (evt.keyCode) {

        	// r-hit
        	case 65:

          		socket.emit('attack', { p_name: sPlayer.name, p_state: 'Right_hit' });
        		break;

        	// d-hit
        	case 83:

          		socket.emit('attack', { p_name: sPlayer.name, p_state: 'Down_hit' });
        		break;

        	// u-hit
        	case 68:

          		socket.emit('attack', { p_name: sPlayer.name, p_state: 'Up_hit' });
        		break;

        	// l-hit
        	case 70:
        	
          		socket.emit('attack', { p_name: sPlayer.name, p_state: 'Left_hit' });
        		break;
		}
    }

	function canvasSupport() {
		return Modernizr.canvas;
	}

	function canvasApp() {
		if(!canvasSupport()){
			return;
		}else{
			var theCanvas = document.getElementById("canvas");
			var context = theCanvas.getContext("2d");
			sChat.init(context);
			sPlayer.set_context(context);
			var formElement = document.getElementById("textBox");
			formElement.addEventListener("keyup",sChat.textBox,false);
		}

		startUp();

		function all_draw() {
			
			if(-100 <= sPlayer.get_xpos() && sPlayer.get_xpos() <= 900 && -100 <= sPlayer.get_ypos() && sPlayer.get_ypos() <= 600){

				sMap.draw(context,temp);
		
				sPlayer.chat();

				if(sPlayer.get_state() != 0){
					if(sPlayer.get_direction() == 0){ //stop

						temp = sPlayer.stay(temp);

					}else if(sPlayer.get_direction() >= 1 && sPlayer.get_direction() <= 4){ //right

						arr2= sPlayer.move(sMap.get_Arr(),temp);

						temp = arr2[0];
						sPlayer.set_state(0);
					
					}else if(sPlayer.get_direction() >= 5 && sPlayer.get_direction() <= 8 && sPlayer.get_hold() != true){ //r-attack

						arr2= sPlayer.attack(sMap.get_Arr(),temp);

						temp = arr2[0];

					}else{
						sPlayer.set_direction(2);
						sPlayer.set_state(0);
					}
				} else{
					temp = sPlayer.stay(temp);
				}
			}else{

				sPlayer.reset();
			}
		}
	

	function startUp(){
		setInterval(all_draw,100);
	}
}

	var temp = 0;
	var flag = true;
	var sPlayer = new Player();
	var hPlayer = new Player();
	var sMap = new Map();
	var sChat = new Chat();
	var splayerList = new Array();


	var socket = io.connect('http://localhost:3000/');

  
	sPlayer.init(name);
	sPlayer.set_cid(c_id);
  sMap.init();
	splayerList.push(sPlayer);

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
          		socket.emit('move', { p_name: sPlayer.name, p_state: 'Left', p_xpos: sPlayer.get_sxpos()-1, p_ypos: sPlayer.get_sypos() });
        		break;

            // Right arrow.
        	case 39:

          		socket.emit('move', { p_name: sPlayer.name, p_state: 'Right', p_xpos: sPlayer.get_sxpos()+1, p_ypos: sPlayer.get_sypos() });
          		break;

            // Down arrow
        	case 40:

          		socket.emit('move', { p_name: sPlayer.name, p_state: 'Down', p_xpos: sPlayer.get_sxpos(), p_ypos: sPlayer.get_sypos()+1 });
          		break;

            // Up arrow 
        	case 38:

          		socket.emit('move', { p_name: sPlayer.name, p_state: 'Up', p_xpos: sPlayer.get_sxpos(), p_ypos: sPlayer.get_sypos()-1 });
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

		socket.on('welcome', function (data){
  		
      var hPlayer = new Player();
  		hPlayer.init(data.name);
  		hPlayer.set_context(context);
  		splayerList.push(hPlayer);
    });

  	socket.on('move_react', function (data) {
    	
      for(var i=0; i < splayerList.length && flag; i++){
    		if(splayerList[i].name == data.p_name){
  		  	splayerList[i].set_direction(data.direction);
       		splayerList[i].set_state(data.state);
       		i = splayerList.length;
       		flag = false;
  		  }
  	  }

		  if(flag){
 		 	  var hPlayer = new Player();
 			  hPlayer.init(data.p_name);
 			  hPlayer.set_context(context);
 		    hPlayer.set_sxpos(data.p_xpos);
 			  hPlayer.set_sypos(data.p_ypos);
 			  splayerList.push(hPlayer);
 			  flag = true;
 		   }

 		 flag = true;
	  });

    socket.on('init', function (data) {
      sMap.set_Arr(data.map);
      socket.emit('hello', { object : test });
    });


    socket.on('attack_react', function (data) {
      for(var i=0; i < splayerList.length && flag; i++){
        if(splayerList[i].name == data.p_name){
          splayerList[i].set_direction(data.direction);
          splayerList[i].set_state(data.state);
          i = splayerList.length;
          flag = false;
        }
      }

      if(flag){
       var hPlayer = new Player();
       hPlayer.init(data.p_name);
       hPlayer.set_context(context);
       hPlayer.set_sxpos(data.p_xpos);
       hPlayer.set_sypos(data.p_ypos);
       splayerList.push(hPlayer);
       flag = true;
      }

      flag = true;
    });

    socket.on('chat_react', function (data) {
      for(var i=0; i < splayerList.length && flag; i++){
       if(splayerList[i].name == data.p_name){
         splayerList[i].set_clength(data.clength);
         splayerList[i].set_message(data.message);
         i = splayerList.length;
         flag = false;
        }
      }

      if(flag){
        var hPlayer = new Player();
        hPlayer.init(data.p_name);
        hPlayer.set_context(context);
        hPlayer.set_sxpos(data.p_xpos);
        hPlayer.set_sypos(data.p_ypos);
        splayerList.push(hPlayer);
        flag = true;
      }
 
      flag = true;
    });

    socket.on('hit_react', function (data) {
      console.log(data.c_map);
      sMap.set_Arr(data.c_map);
    });

    socket.on('clear_react', function (data) {
      var url = "http://localhost:3000/#";    
      $(location).attr('href',url);
    });

		startUp();

		function all_draw() {

				sMap.draw(context,temp);
			
				for(var i = 0; i < splayerList.length; i++){
					
					hPlayer = splayerList[i];

					hPlayer.chat();

				if(hPlayer.get_state() != 0){
					if(hPlayer.get_direction() == 0){ //stop

						temp = hPlayer.stay(temp);

					}else if(hPlayer.get_direction() >= 1 && hPlayer.get_direction() <= 4){ //right

						arr2= hPlayer.move(sMap.get_Arr(),temp);

						temp = arr2[0];
						hPlayer.set_state(0);
					
					}else if(hPlayer.get_direction() >= 5 && hPlayer.get_direction() <= 8 && hPlayer.get_hold() != true){ //attack

						arr2= hPlayer.attack(sMap.get_Arr(),temp);

						temp = arr2[0];

					}else{
						hPlayer.set_direction(2);
            hPlayer.set_state(0);
						temp = hPlayer.stay(temp);

					}
				} else{
					temp = hPlayer.stay(temp);
				}
			}
			
		}

		function startUp(){
			setInterval(all_draw,90);
		}

}

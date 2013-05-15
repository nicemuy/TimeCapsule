
	var direction = 0;
	var temp = 0;
	var rx;
	var ry;
	var state = 1;
	var arr = new Array(200);
	var arr2 = new Array(10);
	var count= 0;
	var hitpoint = 0;
	var clength = 0;
	var hold = true;
	var dx;
	var dy;
	var h = -1;
	var time =0;
	var sPlayer = new Player();
	sPlayer.init();
	
	for (var i = 0; i < 10; i++) {
		for(var j = 0; j <20 ; j++){
			arr[count] = Math.round(Math.random()*100)%2;
			count++;
		}
	}

	for(var i = 0; i < 4; i++){
		arr[(Math.round(Math.random()*10000)%50)+5] = 6;
	}
	arr[13] = 6;

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
          		//alert("left");
          		direction = 4;
          		state = 1;
        		break;

            // Right arrow.
        	case 39:
       
          		direction = 1;
          		state = 1;
          		break;

            // Down arrow
        	case 40:
          		
          		direction = 2;
          		state = 1;
          		break;

            // Up arrow 
        	case 38:
          		direction = 3;
          		state = 1;
        		break;

      	}
    }

    function hitKey(evt) {

        switch (evt.keyCode) {

        	// r-hit
        	case 65:
        		direction =5;
        		state = 1;
        		break;

        	// d-hit
        	case 83:
        		direction =6;
        		state = 1;
        		break;

        	// u-hit
        	case 68:
        		direction =7;
        		state = 1;
        		break;

        	// l-hit
        	case 70:
        		direction =8;
        		state = 1;
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
			var message = "";
			var fillOrStroke = "fill";
			var context = theCanvas.getContext("2d");
			dx=0;
			dy=0;

		}

		var formElement = document.getElementById("textBox");
		formElement.addEventListener("keyup",textBoxChanged,false);

		function textBoxChanged(e){

			if (e.keyCode == 13) {
				
				clength=$("#textBox").val().length;

				time = 0;

				var target = e.target;
				message = target.value;
				$("#textBox").val("");

				sPlayer.set_clength(clength);
				sPlayer.set_message(message);

				sPlayer.chat(context,clength);
				hold = true;
			}
			else{
				hold = false;
			}

		}

		startUp();

		var titleSheet = new Image();
		var hero = new Image();
		var box = new Image();
		var spark = new Image();
		var chat = new Image();
		var border = new Image();

		titleSheet.src="/img/tilesheet.png";
		hero.src="/img/ogre.png";
		box.src="/img/chest.png";
		spark.src="/img/sparks.png";
		chat.src="/img/barsheet.png";
		border.src="/img/border.png";

		drawScreen();

		function drawScreen() {
			context.fillStyle = '#aaaaaa';
			context.fillRect(0,0,1000,600);
		}

		function drawtext(){
			context.font ="50px serif";
			context.fillStyle = '#FF0000';
			context.fillText (message,xPosition,yPosition);
		}

		function drawhero() {

			var metrics = context.measureText(message);
			var textWidth = metrics.width;
			var xPosition = dx;
			var yPosition = dy;
			
			if(-100 <= dx && dx <= 900 && -100 <= dy && dy <= 600){
				
				count=0;
				for (var i = 0; i < 6; i++) {
					for(var j = 0; j <10 ; j++){
						context.drawImage(titleSheet,16*13+16*arr[count],16*7,16,16,100*j,100*i,100,100);
						if(arr[count] == 4){
							context.drawImage(box,0,0,48,48,100*j+25,100*i+25,50,50);
							context.drawImage(spark,48*(temp%6),0,32,48,100*j+25,100*i+25,50,50);
						}
						count++;
					}
				}

				sPlayer.chat(context,message,clength,time);

				if(state != 0){
					if(direction == 0){ //stop

						context.drawImage(hero,48*(temp%2),48*8,48,48,dx,dy,100,100);
						temp++;

					}else if(direction == 1 ){ //right

						arr2= sPlayer.move(arr,direction,temp,context);

						
						temp = arr2[0];
						state =0;

					}else if(direction == 2 ){ //down
						
						arr2= sPlayer.move(arr,direction,temp,context);

						temp = arr2[0];
						state =0;

					}else if(direction == 3 ){ //up
						
						arr2= sPlayer.move(arr,direction,temp,context);
						state =0;

					}else if(direction == 4 ){ //left
					

						arr2= sPlayer.move(arr,direction,temp,context);

						temp = arr2[0];
						state =0;
					
					}else if(direction == 5 && hold == true){ //r-attack

						arr2= sPlayer.attack(arr,direction,temp,context,hold);

						temp = arr2[0];

					}else if(direction == 6 && hold == true){ //d-attack

						arr2= sPlayer.attack(arr,direction,temp,context,hold);

						temp = arr2[0];

					}else if(direction == 7 && hold == true){ //u-attack

						arr2= sPlayer.attack(arr,direction,temp,context,hold);

						temp = arr2[0];

					}else if(direction == 8 && hold == true){ //l-attack

						arr2= sPlayer.attack(arr,direction,temp,context,hold);

						temp = arr2[0];
					}else{
						direction = 2;
						state = 0;
					}
			} else{
					temp = sPlayer.stay(direction,context,temp);
				}
			}else{

				arr2= sPlayer.reset();
				direction = 0;
				state=1;	
			}
				
		}


		function startUp(){
			setInterval(drawhero,70);
		}

	}
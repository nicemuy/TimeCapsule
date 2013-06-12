
function Player(){

	this.init = function(name){
		this.name = name;
		this.hero = new Image();
		this.hero.src='/img/ogre.png';
		this.m_xpos = 0;
		this.m_ypos = 0;
		this.sub_xpos=0;
		this.sub_ypos=0;
		this.h = -1;
		this.time = 0;
		this.message="";
		this.clength=0;
		this.context;
		this.hold=false;
		this.direction=0;
		this.state=1;
		this.hitpoint=true;
		this.c_id=0;
	},

	this.set_cid = function(c_id){
		this.c_id=c_id;
	},

	this.get_name = function(){
		return this.name;
	},

	this.set_direction = function(direction){
		this.direction = direction;
	},

	this.get_direction = function(){
		return this.direction;
	},

	this.set_state = function(state){
		this.state = state;
	},

	this.get_state = function(){
		return this.state;
	},

	this.set_hold = function(hold){
		this.hold = hold;
	},

	this.get_hold = function(){
		return this.hold;
	},

	this.set_context = function(context){
		this.context = context;
	},

	this.get_context = function(){
		return this.context;
	},

	this.get_xpos = function(){
		return this.m_xpos;
	},

	this.get_ypos = function(){
		return this.m_ypos;
	},

	this.get_sxpos = function(){
		return this.sub_xpos;
	},

	this.get_sypos = function(){
		return this.sub_ypos;
	},

	this.set_xpos = function(xpos){
		this.m_xpos = xpos;
	},

	this.set_ypos = function(ypos){
		this.m_ypos = ypos;
	},

	this.set_sxpos = function(xpos){
		this.sub_xpos = xpos;
	},

	this.set_sypos = function(ypos){
		this.sub_ypos = ypos;
	},

	this.set_message = function(message){
		this.message=message;
	},

	this.get_message = function(messate){
		return this.message;
	},
	this.set_clength = function(clength){
		this.clength = clength;
	},
	this.set_time = function(time){
		this.time = time;
	},

	this.move = function(arr,motion){

		this.h=-1;

		if(this.direction == 1 ){ //right
			
			var t=this.m_xpos+100*2/3;
			//alert("hohohoho");
			for(var count=0; count<60; count++){

				if(count*100%1000 == 0){
					this.h++;
				}

				if(count*100%1000 <= t && t < (count*100%1000)+100){

					if( this.h*100-(100*2/3) <= this.m_ypos && this.m_ypos < this.h*100+100-(100*2/3) ){

						if(arr[count] != 6){
							this.sub_xpos++;
						}else{
							alert("땅속에 물체가 감지되었습니다.");
						}
					}
				}
			}

			this.context.drawImage(this.hero,48*(motion%6),48,48,48,this.m_xpos,this.m_ypos,100,100);


		}else if(this.direction == 2 ){ //down
						
			var t=this.m_ypos+100*2/3+100;

			for(var count=0; count<60; count++){

				if(count*100%1000 == 0){
					this.h++;
				}

				if(count*100%1000-(100*1/3)  <= this.m_xpos && this.m_xpos < (count*100%1000)+100-(100*1/3) ){

					if(this.h*100+(100*2/3) <= t && t < this.h*100+100+(100*2/3)){
									
						if(arr[count] != 6){
							this.sub_ypos++;
						}else{
							alert("땅속에 물체가 감지되었습니다.");
						}
					}
				}
			}

			this.context.drawImage(this.hero,48*(motion%6),48*7,48,48,this.m_xpos,this.m_ypos,100,100);

		}else if(this.direction == 3 ){ //up
						
			var t=this.m_ypos-100*1/3;

			for(var count=0; count<60; count++){

				if(count*100%1000 == 0){
					this.h++;
				}

				if(count*100%1000-(100*1/3)  <= this.m_xpos && this.m_xpos < (count*100%1000)+100-(100*1/3) ){
								
					if(this.h*100-(100*2/3) <= t && t < this.h*100+100-(100*2/3)){
									
						if(arr[count] != 6){			
							this.sub_ypos--;

						}else{
							alert("땅속에 물체가 감지되었습니다.");
						}
					}
				}
			}
			
			this.context.drawImage(this.hero,48*(motion%5),48*4,48,48,this.m_xpos,this.m_ypos,100,100);

		}else if(this.direction == 4 ){ //left
						
			var t=this.m_xpos-100;

			for(var count=0; count<60; count++){

				if(count*100%1000 == 0){
					this.h++;
				}

				if( (count*100%1000)-100 <= t && t < (count*100%1000)){
								
					if(this.h*100-(100*2/3) <= this.m_ypos && this.m_ypos < this.h*100+100-(100*2/3)){

						if(arr[count] != 6){
							this.sub_xpos--;
						}else{
							alert("땅속에 물체가 감지되었습니다.");
						}
					}
				}
			}

			this.context.save();
			this.context.transform(-1,0,0,1,0,0);
			this.context.translate(-1000,0);
			this.context.drawImage(this.hero,48*(motion%6),48,48,48,910-this.m_xpos,this.m_ypos,100,100);
			this.context.restore();
		}

		motion++;
		this.m_xpos = (100/3)*this.sub_xpos;
		this.m_ypos = (100/3)*this.sub_ypos;

		return [motion,this.m_xpos,this.m_ypos,this.sub_xpos,this.sub_ypos];
		
	},

	this.attack = function(arr,motion){

		this.h = -1;

		if(this.direction == 5 ){ //r-attack

			this.context.drawImage(this.hero,48*(motion%3),48*0,48,48,this.m_xpos,this.m_ypos,100,100);

			motion++;
						
			if(motion%3 == 0){
				this.state =0;
			}

			var t=this.m_xpos+100*2/3;

			for(var count=0; count<60; count++){

				if(count*100%1000 == 0){
					this.h++;
				}

				if(count*100%1000 <= t && t < (count*100%1000)+100){

					if(this.h*100-(100*2/3) <= this.m_ypos && this.m_ypos < this.h*100+100-(100*2/3)){

						if(arr[count] == 6){
							//alert("count = "+count);

							socket.emit('hit', {p_name: this.name, count : count });
			
						}else if(arr[count] == 5 ){

							if(count == arr[200]){

								socket.emit('last_hit', {p_name: this.name, count : count });

								alert("타임캡슐이 개봉되었습니다!!! ");

								 $.get('/success/'+this.c_id,function(data){

								 	socket.emit('clear', {gameover : true});
								 	var url = "http://www.alsquare.com:3000/";    
									$(location).attr('href',url);
								 });


							}else{
								socket.emit('last_hit', {p_name: this.name, count : count });

								alert("꽝이지롱~~~~~!!!");
							}
						}
					}
				}
			}


		}else if(this.direction == 6 ){ //d-attack

			this.context.drawImage(this.hero,48*(motion%3),48*6,48,48,this.m_xpos,this.m_ypos,100,100);

			motion++;
				
			if(motion%3 == 0){
				this.state =0;
			}

			var t=this.m_ypos+100*2/3+100;

			for(var count=0; count<60; count++){

				if(count*100%1000 == 0){
					this.h++;
				}
						
				if(count*100%1000-(100*1/3)  <= this.m_xpos && this.m_xpos < (count*100%1000)+100-(100*1/3) ){
		
					if(this.h*100+(100*2/3) <= t && t < this.h*100+100+(100*2/3)){
									
						if(arr[count] == 6 ){
							//alert("count = "+count);

							socket.emit('hit', {p_name: this.name, count : count });
			
						}else if(arr[count] == 5 ){

							if(count == arr[200]){

								socket.emit('last_hit', {p_name: this.name, count : count });

								alert("타임캡슐이 개봉되었습니다!!!");

								$.get('/success/'+this.c_id,function(data){

								 	socket.emit('clear', {gameover : true});
								 	var url = "http://www.alsquare.com:3000/";    
									$(location).attr('href',url);
								 });


							}else{
								socket.emit('last_hit', {p_name: this.name, count : count });

								alert("꽝이지롱~~~~~!!!");
							}
						}
					}
				}
			}


		}else if(this.direction == 7 ){ //u-attack

			this.context.drawImage(this.hero,48*(motion%3),48*3,48,48,this.m_xpos,this.m_ypos,100,100);
						
			motion++;
			
			if(motion%3 == 0){
				this.state = 0;
			}

			var t=this.m_ypos-100*1/3;

			for(var count=0; count<60; count++){

				if(count*100%1000 == 0){
					this.h++;
				}

				if(count*100%1000-(100*1/3)  <= this.m_xpos && this.m_xpos < (count*100%1000)+100-(100*1/3) ){
								
					if(this.h*100-(100*2/3) <= t && t < this.h*100+100-(100*2/3)){
						
						if(arr[count] == 6 ){
							//alert("count = "+count);

							socket.emit('hit', {p_name: this.name, count : count });
			
						}else if(arr[count] == 5 ){

							if(count == arr[200]){

								socket.emit('last_hit', {p_name: this.name, count : count });

								alert("타임캡슐이 개봉되었습니다!!!");

								$.get('/success/'+this.c_id,function(data){

								 	socket.emit('clear', {gameover : true});
								 	var url = "http://www.alsquare.com:3000/";    
									$(location).attr('href',url);
								 });


							}else{
								socket.emit('last_hit', {p_name: this.name, count : count });

								alert("꽝이지롱~~~~~!!!");
							}
						}
					}
				}
			}


		}else if(this.direction == 8 ){ //l-attack

			this.context.save();
			this.context.transform(-1,0,0,1,0,0);
			this.context.translate(-1000,0);
			this.context.drawImage(this.hero,48*(motion%3),48*0,48,48,910-this.m_xpos,this.m_ypos,100,100);
			this.context.restore();

			motion++;
				
			if(motion%3 == 0){
				this.state = 0;
			}
					
			var t=this.m_xpos-100;

			for(var count=0; count<60; count++){

				if(count*100%1000 == 0){
					this.h++;
				}

				if( (count*100%1000)-100 <= t && t < (count*100%1000)){
								
					if(this.h*100-(100*2/3) <= this.m_ypos && this.m_ypos < this.h*100+100-(100*2/3)){

						if(arr[count] == 6 ){
							//alert("count = "+count);

							socket.emit('hit', {p_name: this.name, count : count });
			
						}else if(arr[count] == 5 ){

							if(count == arr[200]){

								socket.emit('last_hit', {p_name: this.name, count : count });

								alert("타임캡슐이 개봉되었습니다!!!");

								$.get('/success/'+this.c_id,function(data){

								 	socket.emit('clear', {gameover : true});
								 	var url = "http://www.alsquare.com:3000/";    
									$(location).attr('href',url);
								 });


							}else{
								socket.emit('last_hit', {p_name: this.name, count : count });

								alert("꽝이지롱~~~~~!!!");
							}
						}
					}
				}
			}

		}else{
			this.stay(motion);
		}

		return [motion];
	},

	this.chat = function(){


		if(this.time < 50){

			this.context.font ="20px Lucida Console"; // 채팅글 보여주기
			this.context.fillStyle = '#000000';
			this.context.globalAlpha = 0.5;
			this.context.fillRect(this.m_xpos-5*this.clength-10+30,this.m_ypos-30,28.5*this.clength,40);
			this.context.globalAlpha = 1;
			this.context.fillStyle = '#ffffff';
			this.context.fillText (this.message,this.m_xpos-5*this.clength+30,this.m_ypos-5);
			this.time++;

		}else{
			
			this.time =0;
			this.clength=0;
			this.message="";

		}
	},

	this.stay = function(motion){

		if(this.direction == 1 || this.direction == 5){ //right
			this.context.drawImage(this.hero,48*(motion%2),48*2,48,48,this.m_xpos,this.m_ypos,100,100);
			motion++;
		}else if(this.direction == 2 || this.direction == 6 || this.direction == 0){ //down
			this.context.drawImage(this.hero,48*(motion%2),48*8,48,48,this.m_xpos,this.m_ypos,100,100);
			motion++;	
		}else if(this.direction == 3 || this.direction == 7 ){ //up
			this.context.drawImage(this.hero,48*(motion%2),48*5,48,48,this.m_xpos,this.m_ypos,100,100);
			motion++;
		}else if(this.direction == 4 || this.direction == 8){ //left
			this.context.save();
			this.context.transform(-1,0,0,1,0,0);
			this.context.translate(-1000,0);
			this.context.drawImage(this.hero,48*(motion%2),48*2,48,48,910-this.m_xpos,this.m_ypos,100,100);
			this.context.restore();
			motion++;
		}
		return motion;
	},

	this.reset = function(){

		this.m_xpos=0;
		this.m_ypos=0;
		this.sub_xpos=0;
		this.sub_ypos=0;
		this.direction =0;
		this.state=1;
	};

};
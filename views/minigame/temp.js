

function Player(){

	this.init = function(){
		this.name = 'asd';
		this.hero = new Image();
		this.hero.src='ogre.png';
		this.m_xpos = 0;
		this.m_ypos = 0;
		this.sub_xpos=0;
		this.sub_ypos=0;
		this.h = -1;
		this.time = 0;
		this.message="";
		this.clength=0;	
	},

	this.get_xpos = function(){
		return this.m_xpos;
	},

	this.get_ypos = function(){
		return this.m_ypos;
	},

	this.set_xpos = function(xpos){
		this.m_xpos = xpos;
	},

	this.set_ypos = function(ypos){
		this.m_ypos = ypos;
	},

	this.set_message = function(message){
		this.message=message;
	},

	this.get_messate = function(messate){
		return this.message;
	},
	this.set_clength = function(clength){
		this.clength = clength;
	},

	this.move = function(arr,direction,motion,context){

		//this.m_xpos = t_xpos;
		//this.m_ypos = t_ypos;
		this.h=-1;

		if(direction == 1 ){ //right

			var t=this.m_xpos+100*2/3;

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

			context.drawImage(this.hero,48*(motion%6),48,48,48,this.m_xpos,this.m_ypos,100,100);


		}else if(direction == 2 ){ //down
						
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

			context.drawImage(this.hero,48*(motion%6),48*7,48,48,this.m_xpos,this.m_ypos,100,100);

		}else if(direction == 3 ){ //up
						
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

			context.drawImage(this.hero,48*(motion%5),48*4,48,48,this.m_xpos,this.m_ypos,100,100);

		}else if(direction == 4 ){ //left
						
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

			context.save();
			context.transform(-1,0,0,1,0,0);
			context.translate(-1000,0);
			context.drawImage(this.hero,48*(motion%6),48,48,48,910-this.m_xpos,this.m_ypos,100,100);
			context.restore();
		}

		motion++;
		this.m_xpos = (100/3)*this.sub_xpos;
		this.m_ypos = (100/3)*this.sub_ypos;
		this.h = -1;

		return [motion,this.m_xpos,this.m_ypos,this.sub_xpos,this.sub_ypos];
		
	},

	this.attack = function(arr,direction,motion,context,hold){

		this.h = -1;

		if(direction == 5 && hold == true){ //r-attack

			context.drawImage(this.hero,48*(motion%3),48*0,48,48,this.m_xpos,this.m_ypos,100,100);

			motion++;
						
			if(motion%3 == 0){
				state =0;
				hitpoint = 0;
			}

			var t=this.m_xpos+100*2/3;

			for(var count=0; count<60; count++){

				if(count*100%1000 == 0){
					this.h++;
				}

				if(count*100%1000 <= t && t < (count*100%1000)+100){

					if(this.h*100-(100*2/3) <= this.m_ypos && this.m_ypos < this.h*100+100-(100*2/3)){

						if(arr[count] == 6 || arr[count] == 5 && hitpoint == 0 ){
										
							arr[count] = arr[count]-1;

						}else if(arr[count] == 4){
					
							arr[count] = 1;	

							alert("타임캡슐이 개봉되었습니다!!!");
						}
					}
				}
			}


		}else if(direction == 6 ){ //d-attack

			context.drawImage(this.hero,48*(motion%3),48*6,48,48,this.m_xpos,this.m_ypos,100,100);

			motion++;
				
			if(motion%3 == 0){
				state =0;
				hitpoint = 0;
			}

			var t=this.m_ypos+100*2/3+100;

			for(var count=0; count<60 && hitpoint == 0; count++){

				if(count*100%1000 == 0){
					this.h++;
				}
						
				if(count*100%1000-(100*1/3)  <= this.m_xpos && this.m_xpos < (count*100%1000)+100-(100*1/3) ){
		
					if(this.h*100+(100*2/3) <= t && t < this.h*100+100+(100*2/3)){
									
						if(arr[count] == 6 || arr[count] == 5 && hitpoint == 0 ){
										
							arr[count] = arr[count]-1;
							hitpoint = 1;

						}else if(arr[count] == 4){

							arr[count] = 1;	
							alert("타임캡슐이 개봉되었습니다!!!");
						}
					}
				}
			}


		}else if(direction == 7 ){ //u-attack

			context.drawImage(this.hero,48*(motion%3),48*3,48,48,this.m_xpos,this.m_ypos,100,100);
						
			motion++;
			
			if(motion%3 == 0){
				state = 0;
				hitpoint = 0;
			}

			var t=this.m_ypos-100*1/3;

			for(var count=0; count<60 && hitpoint == 0; count++){

				if(count*100%1000 == 0){
					this.h++;
				}

				if(count*100%1000-(100*1/3)  <= this.m_xpos && this.m_xpos < (count*100%1000)+100-(100*1/3) ){
								
					if(this.h*100-(100*2/3) <= t && t < this.h*100+100-(100*2/3)){
						
						if(arr[count] == 6 || arr[count] == 5 && hitpoint == 0 ){
										
							arr[count] = arr[count]-1;
							hitpoint = 1;

						}else if(arr[count] == 4){

							arr[count] = 1;	
							alert("타임캡슐이 개봉되었습니다!!!");
						}
					}
				}
			}


		}else if(direction == 8 ){ //l-attack

			context.save();
			context.transform(-1,0,0,1,0,0);
			context.translate(-1000,0);
			context.drawImage(this.hero,48*(motion%3),48*0,48,48,910-this.m_xpos,this.m_ypos,100,100);
			context.restore();

			motion++;
				
			if(motion%3 == 0){
				state = 0;
				hitpoint = 0;
			}
					
			var t=this.m_xpos-100;

			for(var count=0; count<60; count++){

				if(count*100%1000 == 0){
					this.h++;
				}

				if( (count*100%1000)-100 <= t && t < (count*100%1000)){
								
					if(this.h*100-(100*2/3) <= this.m_ypos && this.m_ypos < this.h*100+100-(100*2/3)){

						if(arr[count] == 6 || arr[count] == 5 && hitpoint == 0 ){
										
							arr[count] = arr[count]-1;
							hitpoint = 1;

						}else if(arr[count] == 4){
										
							arr[count] = 1;	
							alert("타임캡슐이 개봉되었습니다!!!");
						}
					}
				}
			}

		}else{
			this.stay(direction,context,motion);
		}

		return [motion];
	},

	this.chat = function(context,message,clength){

		
		//this.clength=clength;
		var pre_message;

		if(this.time < 100){

			context.font ="20px Lucida Console"; // 채팅글 보여주기
			context.fillStyle = '#000000';
			context.globalAlpha = 0.5;
			context.fillRect(this.m_xpos-5*clength-10+30,this.m_ypos-30,28.5*this.clength,40);
			context.globalAlpha = 1;
			context.fillStyle = '#ffffff';
			context.fillText (this.message,this.m_xpos-5*this.clength+30,this.m_ypos-5);
			pre_message=this.message;
			this.time++;

		}else{

			this.time =0;
			this.clength=0;
			this.message="";

		}
	},

	this.stay = function(direction,context,motion){

		if(direction == 1 || direction == 5){ //right
			context.drawImage(this.hero,48*(motion%2),48*2,48,48,this.m_xpos,this.m_ypos,100,100);
			motion++;
		}else if(direction == 2 || direction == 6 ){ //down
			context.drawImage(this.hero,48*(motion%2),48*8,48,48,this.m_xpos,this.m_ypos,100,100);
			motion++;	
		}else if(direction == 3 || direction == 7 ){ //up
			context.drawImage(this.hero,48*(motion%2),48*5,48,48,this.m_xpos,this.m_ypos,100,100);
			motion++;
		}else if(direction == 4 || direction == 8){ //left
			context.save();
			context.transform(-1,0,0,1,0,0);
			context.translate(-1000,0);
			context.drawImage(this.hero,48*(motion%2),48*2,48,48,910-this.m_xpos,this.m_ypos,100,100);
			context.restore();
			motion++;
		}
		return motion;
	},
	this.reset = function(){

		this.m_xpos=0;
		this.m_ypos=0;
		direction =0;
		state=1;
	};

};
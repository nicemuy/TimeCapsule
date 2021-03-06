
exports.Player = {

	init : function(){

		this.name = 'asd';
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
	},

	set_direction : function(direction){
		this.direction = direction;
	},

	get_direction : function(){
		return this.direction;
	},

	set_state : function(state){
		this.state = state;
	},

	get_state : function(){
		return this.state;
	},

	set_hold : function(hold){
		this.hold = hold;
	},

	get_hold : function(){
		return this.hold;
	},

	set_context : function(context){
		this.context = context;
	},

	get_context : function(){
		return this.context;
	},

	get_xpos : function(){
		return this.m_xpos;
	},

	get_ypos : function(){
		return this.m_ypos;
	},

	set_xpos : function(xpos){
		this.m_xpos = xpos;
	},

	set_ypos : function(ypos){
		this.m_ypos = ypos;
	},

	set_message : function(message){
		this.message=message;
	},

	get_message : function(messate){
		return this.message;
	},

	set_clength : function(clength){
		this.clength = clength;
	},

	get_clength : function(){
		return this.clength;
	},

	move : function(arr,motion){

		this.h=-1;
		//alert("hohohoho");

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

	attack : function(arr,motion){

		this.h = -1;

		if(this.direction == 5 ){ //r-attack

			this.context.drawImage(this.hero,48*(motion%3),48*0,48,48,this.m_xpos,this.m_ypos,100,100);

			motion++;
						
			if(motion%3 == 0){
				this.state =0;
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
							socket.emit('hit', { count: count });

						}else if(arr[count] == 4){
					
							arr[count] = 1;	

							alert("타임캡슐이 개봉되었습니다!!!");
						}
					}
				}
			}


		}else if(this.direction == 6 ){ //d-attack

			this.context.drawImage(this.hero,48*(motion%3),48*6,48,48,this.m_xpos,this.m_ypos,100,100);

			motion++;
				
			if(motion%3 == 0){
				this.state =0;
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


		}else if(this.direction == 7 ){ //u-attack

			this.context.drawImage(this.hero,48*(motion%3),48*3,48,48,this.m_xpos,this.m_ypos,100,100);
						
			motion++;
			
			if(motion%3 == 0){
				this.state = 0;
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


		}else if(this.direction == 8 ){ //l-attack

			this.context.save();
			this.context.transform(-1,0,0,1,0,0);
			this.context.translate(-1000,0);
			this.context.drawImage(this.hero,48*(motion%3),48*0,48,48,910-this.m_xpos,this.m_ypos,100,100);
			this.context.restore();

			motion++;
				
			if(motion%3 == 0){
				this.state = 0;
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
			this.stay(motion);
		}

		return [motion];
	},

	chat : function(){


		if(this.time < 100){

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

	stay : function(motion){

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

	reset : function(){

		this.m_xpos=0;
		this.m_ypos=0;
		this.sub_xpos=0;
		this.sub_ypos=0;
		this.direction =0;
		this.state=1;
	}

}
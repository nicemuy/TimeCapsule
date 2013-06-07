
exports.Map = {

	init : function(){
		
		this.arr = new Array(201);
		this.count = 0;
		this.t_arr = new Array();
		this.t_count = 0;
		this.capsule = 0;

		for (var i = 0; i < 10; i++) {
			for(var j = 0; j <20 ; j++){
				this.arr[this.count] = Math.round(Math.random()*100)%2;
				this.count++;
			}
		}

		for(var i = 0; i < 4; i++){
			this.arr[(Math.round(Math.random()*10000)%50)+5] = 6;
		}

		this.arr[22] = 6;

		this.count = 0;

		for (var i = 0; i < 10; i++) {
			for(var j = 0; j <20 ; j++){
				if(this.arr[this.count] == 6){
					this.t_arr[this.t_count] = this.count;
					this.t_count++;
				}
				this.count++;
			}
		}

		var temp = Math.round(Math.random()*100) % this.t_arr.length;

		this.capsule = this.t_arr[temp];

		this.arr[200] = this.capsule;

	},

	get_Arr : function(){
		return this.arr;
	},

	set_Arr : function(arr){
		return this.arr = arr;
	},

	drawScreen : function(){
		context.fillStyle = '#aaaaaa';
		context.fillRect(0,0,1000,600);
	},

	drawtext : function(){
		context.font ="50px serif";
		context.fillStyle = '#FF0000';
		context.fillText (message,xPosition,yPosition);
	},

	draw : function(context,temp){

		this.count = 0;
		for (var i = 0; i < 6; i++) {
			for(var j = 0; j <10 ; j++){
				context.drawImage(this.titleSheet,16*13+16*this.arr[this.count],16*7,16,16,100*j,100*i,100,100);
				if(this.arr[this.count] == 4){
					context.drawImage(this.box,0,0,48,48,100*j+25,100*i+25,50,50);
					context.drawImage(this.spark,48*(temp%6),0,32,48,100*j+25,100*i+25,50,50);
				}
				this.count++;
			}
		}
	}
}

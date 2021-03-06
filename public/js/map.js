
function Map(){

	this.init = function(){
		
		this.arr = new Array(200);
		this.titleSheet = new Image();
		this.titleSheet.src="/img/tilesheet.png";
		this.c_id;
		
		this.box = new Image();
		this.spark = new Image();
		this.shadow = new Image();
		
		this.box.src="/img/chest.png";
		this.spark.src="/img/sparks.png";
		this.shadow.src="/img/shadow.png";

	},
	
	this.set_cid = function(c_id){
		this.c_id = c_id;
	},

	this.get_Arr = function(){
		return this.arr;
	},

	this.set_Arr = function(arr){
		return this.arr = arr;
	},

	this.drawScreen = function(){
		context.fillStyle = '#aaaaaa';
		context.fillRect(0,0,1000,600);
	},

	this.drawtext = function(){
		context.font ="50px serif";
		context.fillStyle = '#FF0000';
		context.fillText (message,xPosition,yPosition);
	},

	this.draw = function(context,temp){

		//alert("asd");
		var count = 0;
		for (var i = 0; i < 6; i++) {
			for(var j = 0; j <10 ; j++){
				context.drawImage(this.titleSheet,16*13+16*this.arr[count],16*7,16,16,100*j,100*i,100,100);
				if(this.arr[count] == 4){
					context.drawImage(this.box,0,0,48,48,100*j+25,100*i+25,50,50);
					context.drawImage(this.spark,48*(temp%6),0,32,48,100*j+25,100*i+25,50,50);
					$.get('/success/'+this.c_id,function(data){

								 	socket.emit('clear', {gameover : true});
								 	var url = "http://www.alsquare.com:3000/";    
									$(location).attr('href',url);
								 });

				}else if(this.arr[count] == -1){
					context.drawImage(this.shadow,0,0,48,48,100*j+25,100*i+25,50,50);
				}
				count++;
			}
		}
	};

}
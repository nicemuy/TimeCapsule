
function Chat(){

	this.init = function(context){
		this.clength="";
		this.time=0;
		this.hold=false;
		this.message = "";
		this.context=context;
	},

	this.get_hold = function(){
		//alert("this.hold === "+this.hold);
		return this.hold;
	},

	this.get_clength = function(){
		return this.clength;
	},

	this.textBox = function(e){
		if (e.keyCode == 13) {
			
			sPlayer.set_hold(false);
			sPlayer.set_time(0);
			
			socket.emit('chat', { p_name: sPlayer.name, content: $("#textBox").val() });
			
			$("#textBox").val("");

		}
		else{
			sPlayer.set_hold(true);
		}

	};
};
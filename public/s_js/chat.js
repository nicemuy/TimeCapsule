
exports.Chat = {

	init : function(){
		
		this.clength="";
		this.time=0;
		this.hold=false;
		this.message = "";
		this.context= "";
	},

	get_hold : function(){
		return this.hold;
	},

	get_clength : function(){
		return this.clength;
	},

	textBox : function(content){

		player.set_clength(content.length);
		player.set_message(content);
	}

}

function PlayerList(){
	this.init = function(){
		this.list = new Array(20);
		this.count=0;
	},

	this.add = function(player){
		this.list[this.count] = player;
		this.count++;
	},

	this.find = function(player){
		for(var i=0; i < this.count; i++){
			if(this.list[i].name == player.name){
				return this.list[i];
			}
		}
	};
};
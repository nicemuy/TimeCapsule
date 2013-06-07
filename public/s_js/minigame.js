
exports.Minigame = {

  hello : function(data,socket){
    socket.broadcast.emit('welcome', { name : data.object });
  },

  move : function(data,io,player){

    switch(data.p_state){
      case 'Right' :
        player.set_direction(1);
        player.set_state(1);
        break;

      case 'Left' :
        player.set_direction(4);
        player.set_state(1);
        break;

      case 'Up' :
        player.set_direction(3);
        player.set_state(1);
        break;

      case 'Down' :
        player.set_direction(2);
        player.set_state(1);
        break;
    }
    
    io.sockets.emit('move_react', { p_name : data.p_name , direction : player.get_direction() , state : player.get_state() , p_xpos : data.p_xpos, p_ypos : data.p_ypos} );
  },

  attack : function(data,io,player){

     switch(data.p_state){
      case 'Right_hit' :
        player.set_direction(5);
        player.set_state(1);
        break;

      case 'Left_hit' :
        player.set_direction(8);
        player.set_state(1);
        break;

      case 'Up_hit' :
        player.set_direction(7);
        player.set_state(1);
        break;

      case 'Down_hit' :
        player.set_direction(6);
        player.set_state(1);
        break;
    }
    
    io.sockets.emit('attack_react', { p_name : data.p_name , direction : player.get_direction() , state : player.get_state() });
  },

  chat : function(data,io,player){

    player.set_clength(data.content.length);
    player.set_message(data.content);    
    
    io.sockets.emit('chat_react', { p_name : data.p_name , clength : player.get_clength() , message : player.get_message() });
  },

  hit : function(data,io,map){

    var arr = map.get_Arr();
    console.log("data.count ="+data.count);
    arr[data.count] = arr[data.count] - 1;
    map.set_Arr(arr);

    io.sockets.emit('hit_react', { c_map : map.get_Arr() });
  },

  last_hit : function(data,io,map){

    var arr = map.get_Arr();
  
    if(data.count != arr[200]){
      arr[data.count] = -1;
    }else{
      arr[data.count] = 4;
    }
    map.set_Arr(arr);

    io.sockets.emit('hit_react', { c_map : map.get_Arr() });

  }
}
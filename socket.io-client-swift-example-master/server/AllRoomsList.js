var io = require("socket.io").listen(7000);

io.configure(function(){  
    io.set('log level', 2);
});



var request = require("request")

var roomurl = "http://mobile.sharebasket.com/room";

var allRooms;

request({
    url: roomurl,
    json: true
}, function (error, response, body) {
    
        allRooms = body;
    if (!error && response.statusCode === 200) {
       // console.log(body) // Print the json response
    }
});


//var allRooms = getAllRooms;

console.log(allRooms);

var socketRoom = {};

var userNames = {};//id
var selectCharacter={};
var userNum={};//position in waitRoom

var thrashNum=[];//shoud be at the each room
var thrashIdx=0;//shoud be at the each room

for(thrashIdx=0;thrashIdx<6;thrashIdx++){
    thrashNum[thrashIdx] = 5-thrashIdx;
}
thrashIdx--;

io.sockets.on('connection', function (socket) {	      
    console.log("A user connected !");    

 
    
    
    socket.on("getAllRoomREQ", function(data){
        
        io.sockets.emit("getAllRoomRES", allRooms );//allRooms);
        
        
       
    });
    
    socket.on('disconnect',function(data){
        var rooms = io.sockets.manager.rooms;
        var key = socketRoom[socket.id];
        
        if(key!=null){//if client did enter the room
             key = '/'+key;
            if(rooms[key].length<=1){
                for(var i in socketRoom){                
                    delete(socketRoom[i])
                 }
                 for(var i in userNames){
                    delete(userNames[i])                     
                }
                 for(var i in selectCharacter){
                    delete(selectCharacter[i])                     
                }
                for(var i in userNum){
                    delete(userNum[i])                     
                } 
                
                for(thrashIdx=0;thrashIdx<6;thrashIdx++){
                    thrashNum[thrashIdx] = 5-thrashIdx;
                }
                thrashIdx--;
            }else{
                var ret = userNum[userNames[socket.id]];
                thrashIdx++;
                thrashNum[thrashIdx] = ret;
                io.sockets.in(socketRoom[socket.id]).emit("imoutRES", ret);                
                delete(userNum[userNames[socket.id]]);
                delete(selectCharacter[userNames[socket.id]]);
                delete(socketRoom[socket.id]);
                delete(userNames[socket.id]);
                
            }
            socket.leave(key);
        }
    });
});



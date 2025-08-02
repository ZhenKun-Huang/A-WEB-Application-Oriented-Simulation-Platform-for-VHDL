let start=0



function entrystartsim(){
  start=1;
  $("bstop").disabled=false;
  $("bstart").disabled=true;
  socket.emit('startt',start)
}
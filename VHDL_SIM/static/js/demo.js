"use strict";
const dragmsg = "<b>Drag your VHDL/Verilog file to this window</b>";
const dropmsg = "<h1><mark>Drop that VHDL file!</mark></h1>";
const endmark = "%%END%%";
const vhdlmark = "%%%VHDL%%%";
const publicmark = "%%PUBLIC%%";
const privatemark = "%%PRIVATE%%";
let start=0;//状态量，以此来判断仿真是否开始
let sending=false;
let vhdlfile=null;
let vhdlreader=null;
let vhdl="";
let fileHandle=null;
const socket = io();
const pickerOpts = {
  id: 'hdlfiles',
  types: [
    {
      description: "VHDL/Verilog files",
      accept: {
        "hdl/*": [".vhd", ".vhdl",".v", ".sv", ".vho"],
      },
    },
  ],
  excludeAcceptAllOption: false,
  multiple: false,
};



let cid
        socket.on('receive_sid',function (data){
            cid=data
        })




function $(id){ return document.getElementById(id); }
function logAdd(msg){ $("log").innerHTML+='<b><pre>'+msg+'</pre></b>'; }
function log(msg){ $("log").innerHTML='<b><pre>'+msg+'</pre></b>'; }


//文件处理
function updateHandle() {
  if (fileHandle==null) {
    $("breload").style.display="none";
  } else {
    pickerOpts.startIn=fileHandle;
    $("breload").style.display="inline";
  }
}

function vhdlUpdate(newvhdl, rewrite=true) {
  if (rewrite) vhdl=newvhdl;
  if (newvhdl.indexOf(publicmark)>=0)
    $("vhdlcode").innerHTML="Press START to view and simulate the remote HDL file.";
  else if (newvhdl.indexOf(privatemark)>=0)
    $("vhdlcode").innerHTML="Press START to simulate the remote HDL example.";
  else {
    $("vhdlcode").innerHTML=newvhdl;
    $("vhdlcode").removeAttribute("data-highlighted"); // para que lo pueda highlightear de nuevo
    let lengua="language-vhdl";
    if (newvhdl.indexOf("endmodule")>=0) if (newvhdl.indexOf("input")>=0) lengua="language-verilog";
    $("vhdlcode").className = "container-fluid "+lengua;
    hljs.highlightAll();
              socket.emit('vhdll',{

        data:vhdl,
        cid:cid
    });



  }
}

  socket.on('comcode',function (data){
    if(data =='0'){
        quitsim();
          socket.on('com',function (data){
    log(data);
});
}
  });

function loadFile(file) {
  vhdlfile=file;
  vhdlreader = new FileReader();
  vhdlreader.onload = function() {
    let cosa=vhdlreader.result
    if (cosa.length<400000) {
      vhdlUpdate(cosa);

    } else {
      console.log("Fichero muy grande, tamaño: "+cosa.length);
    }
  };
  vhdlreader.onerror = function() { console.log("Error reading file"); };
  vhdlreader.readAsText(vhdlfile);
  $("bstart").disabled=false;
}

async function reloadFile() {
  if (fileHandle==null) return;
  let file;
  try {
    file = await fileHandle.getFile();
  } catch (error) {
    return;
  }
  loadFile(file);
  stopsim();
}

async function loadFileClick() {
  if ('showOpenFilePicker' in window) {
    try {
      [fileHandle] = await window.showOpenFilePicker(pickerOpts);
      vhdlfile = await fileHandle.getFile();
      updateHandle();
    } catch (error) { // happens when cancel
      return;
    }
    loadFile(vhdlfile);

  } else {
    $("breload").style.display="none";
    $("vhdlinput").click(); // llama a loadSelFile
  }
  log("");

}

function loadSelFile() {
  let vhdlin = $("vhdlinput");
  if ('files' in vhdlin) {
    if (vhdlin.files.length > 0) {
      let file = vhdlin.files[0];
      loadFile(file);
    }
  }
  vhdlin.value=""; // para que pueda volver a cargar el mismo fichero
}

async function dropHandler(ev) {
  dragLeave();
  ev.preventDefault();
  if (ev.dataTransfer.items) { // usually true
    for (let i=0; i<ev.dataTransfer.items.length; i++) {
      const item=ev.dataTransfer.items[i];
      if (item.kind === "file") {
        const file = item.getAsFile();
        if (file.name.toLowerCase().indexOf(".v")>=0) {
          if ('getAsFileSystemHandle' in item) {
            fileHandle=await item.getAsFileSystemHandle();
            //file=await fileHandle.getAsFile(); // no hace falta, pues ya esta el del item
            updateHandle();
          } else {
            $("breload").style.display="none";
          }
          loadFile(file);
          break;
        }
      }
    }
  } else {

    [...ev.dataTransfer.files].forEach((file, i) => {
      loadFile(file);
    });
  }
}





let btnn1='1'
let btnn0='0'

function checkled(num) {
    // 检查个位
    if (num % 10 === 1) {
        $("led0").style.color = "#ed080e";
    }else{
      $("led0").style.color = "#040504";
    }


    // 检查十位
    if (Math.floor(num / 10) % 10 === 1) {
     $("led1").style.color = "#ed080e";
    }else{
      $("led1").style.color = "#040504";
    }

    // 检查百位
    if (Math.floor(num / 100) % 10 === 1) {
     $("led2").style.color = "#ed080e";
    } else{
      $("led2").style.color = "#040504";
    }
    // 检查千位
    if (Math.floor(num / 1000) % 10 === 1) {
    $("led3").style.color = "#ed080e";
    }else{
      $("led3").style.color = "#040504";
    }
    // 检查万位
    if (Math.floor(num / 10000) % 10 === 1) {
$("led4").style.color = "#ed080e";
    }else{
      $("led4").style.color = "#040504";
    }
        if (Math.floor(num / 100000) % 10 === 1) {
$("led5").style.color = "#ed080e";
    }else{
      $("led5").style.color = "#040504";
    }
                    if (Math.floor(num / 1000000) % 10 === 1) {
$("led6").style.color = "#ed080e";
    }else{
      $("led6").style.color = "#040504";
    }

            if (Math.floor(num / 10000000) % 10 === 1) {
$("led7").style.color = "#ed080e";
    }else{
      $("led7").style.color = "#040504";
    }
}

function checkseg0(num) {

      if (num % 10 === 1) {
   $("seg0G").style.backgroundColor = "#ed080e";
    }else{
   $("seg0G").style.backgroundColor = "#040504";
    }

      if (Math.floor(num / 10) % 10 === 1) {
   $("seg0F").style.backgroundColor = "#ed080e";
    }else{
 $("seg0F").style.backgroundColor = "#040504";
    }
      if (Math.floor(num / 100) % 10 === 1) {
   $("seg0E").style.backgroundColor = "#ed080e";
    }else{
 $("seg0E").style.backgroundColor = "#040504";
    }

      if (Math.floor(num / 1000) % 10 === 1) {
   $("seg0D").style.backgroundColor = "#ed080e";
    }else{
 $("seg0D").style.backgroundColor = "#040504";
    }

      if (Math.floor(num / 10000) % 10 === 1) {
   $("seg0C").style.backgroundColor = "#ed080e";
    }else{
 $("seg0C").style.backgroundColor = "#040504";
    }


          if (Math.floor(num / 100000) % 10 === 1) {
   $("seg0B").style.backgroundColor = "#ed080e";
    }else{
 $("seg0B").style.backgroundColor = "#040504";
    }
                if (Math.floor(num / 1000000) % 10 === 1) {
   $("seg0A").style.backgroundColor = "#ed080e";
    }else{
 $("seg0A").style.backgroundColor = "#040504";
    }
}

function checkseg1(num) {

      if (num % 10 === 1) {
   $("seg1G").style.backgroundColor = "#ed080e";
    }else{
   $("seg1G").style.backgroundColor = "#040504";
    }

      if (Math.floor(num / 10) % 10 === 1) {
   $("seg1F").style.backgroundColor = "#ed080e";
    }else{
 $("seg1F").style.backgroundColor = "#040504";
    }
      if (Math.floor(num / 100) % 10 === 1) {
   $("seg1E").style.backgroundColor = "#ed080e";
    }else{
 $("seg1E").style.backgroundColor = "#040504";
    }

      if (Math.floor(num / 1000) % 10 === 1) {
   $("seg1D").style.backgroundColor = "#ed080e";
    }else{
 $("seg1D").style.backgroundColor = "#040504";
    }

      if (Math.floor(num / 10000) % 10 === 1) {
   $("seg1C").style.backgroundColor = "#ed080e";
    }else{
 $("seg1C").style.backgroundColor = "#040504";
    }


          if (Math.floor(num / 100000) % 10 === 1) {
   $("seg1B").style.backgroundColor = "#ed080e";
    }else{
 $("seg1B").style.backgroundColor = "#040504";
    }
                if (Math.floor(num / 1000000) % 10 === 1) {
   $("seg1A").style.backgroundColor = "#ed080e";
    }else{
 $("seg1A").style.backgroundColor = "#040504";
    }
}




        // 更新数据的函数
        function updateValue(elementId, value) {
            const element = document.getElementById(elementId);
            element.classList.remove('update');
            void element.offsetWidth; // 触发重绘
            element.classList.add('update');
        }
        // 监听数据更新事件
        socket.on('update_data', function(data) {
          let com=0
socket.emit('comle', {cid: cid,  // 携带 sid
                data: 0})
          //更新led显示
if (data.yesorno=='1'){
          if (start == 1) {
            checkled(data.sales);

document.getElementById('timestamp').textContent = '最后更新时间: ' + data.timestamp;
checkseg0(data.seg0);
checkseg1(data.seg1);
          }}
if (data.yesorno=='0'){
          if (start == 1) {
          }}


          socket.emit('comle',{
                              cid: cid,  // 携带 cid
                data: 1
            }
          )

          }
        );



//将数码管切换状态
function toggleSegment(segmentId) {
        const segment = document.getElementById(segmentId);
        if (segment.style.backgroundColor === 'rgb(255, 0, 0)') { // 如果当前是红色
            segment.style.backgroundColor = '#333'; // 切换到熄灭状态颜色
        } else {
            segment.style.backgroundColor = '#FF0000'; // 改为红色表示点亮状态
        }
    }




  function btn0up(){
   if(start==1){
    socket.emit('btn',{

        data:"0000",
        cid:cid
    });
  }}
    function btn0down(){
    if(start==1){
    socket.emit('btn',{

        data:"0001",
        cid:cid
    });
  }}
    function btn1up(){
    if(start==1){
    socket.emit('btn',{

        data:"0000",
        cid:cid
    });
  }}
    function btn1down(){
    if(start==1){
    socket.emit('btn',{

        data:"0010",
        cid:cid
    });
  }}
    function btn2up(){
    if(start==1){
    socket.emit('btn',{

        data:"0000",
        cid:cid
    });
  }}
    function btn2down(){
    if(start==1){
    socket.emit('btn',{

        data:"0100",
        cid:cid
    });
  }}
    function btn3up(){
    if(start==1){
    socket.emit('btn',{

        data:"0000",
        cid:cid
    });
  }}
    function btn3down(){
    if(start==1){
    socket.emit('btn',{

        data:"1000",
        cid:cid
    });
  }}

function resetledseg(){

  $("led0").style.color="#040504";
  $("led1").style.color="#040504";
  $("led2").style.color="#040504";
  $("led3").style.color="#040504";
  $("led4").style.color="#040504";
  $("led5").style.color="#040504";
  $("led6").style.color="#040504";
  $("led7").style.color="#040504";
                  $("seg1A").style.backgroundColor = "#040504";
                $("seg1B").style.backgroundColor = "#040504";
                $("seg1C").style.backgroundColor = "#040504";
                $("seg1D").style.backgroundColor = "#040504";
                $("seg1E").style.backgroundColor = "#040504";
                $("seg1F").style.backgroundColor = "#040504";
                $("seg1G").style.backgroundColor = "#040504";
                $("seg0A").style.backgroundColor = "#040504";
                $("seg0B").style.backgroundColor = "#040504";
                $("seg0C").style.backgroundColor = "#040504";
                $("seg0D").style.backgroundColor = "#040504";
                $("seg0E").style.backgroundColor = "#040504";
                $("seg0F").style.backgroundColor = "#040504";
                $("seg0G").style.backgroundColor = "#040504";
}




//点击sw开关触发，更新输入开关数据
function checkToggleStatus() {
    var swinput = new Array();
swinput[0] = 0;
swinput[1] = 0;
swinput[2] = 0;
swinput[3] = 0;
swinput[4] = 0;
swinput[5] = 0;
swinput[6] = 0;
swinput[7] = 0;

    var toggleSwitch0 = document.getElementById('Switch0');
    var toggleSwitch1 = document.getElementById('Switch1');
    var toggleSwitch2 = document.getElementById('Switch2');
    var toggleSwitch3 = document.getElementById('Switch3');
    var toggleSwitch4 = document.getElementById('Switch4');
    var toggleSwitch5 = document.getElementById('Switch5');
    var toggleSwitch6 = document.getElementById('Switch6');
    var toggleSwitch7 = document.getElementById('Switch7');
    if (toggleSwitch7.checked) {
        if(start==1){
          swinput[0] = 1;
       }
    } else{
        if(start==1){
          swinput[0] = 0;
}
    }
        if (toggleSwitch6.checked) {
        if(start==1){
          swinput[1] = 1;
       }
    } else {
        if(start==1){
          swinput[1] = 0;
}
    }
                if (toggleSwitch5.checked) {
        if(start==1){
          swinput[2] = 1;
       }
    } else {
        if(start==1){
          swinput[2] = 0;
}
    }
                if (toggleSwitch4.checked) {
        if(start==1){
          swinput[3] = 1;
       }
    } else {
        if(start==1){
          swinput[3] = 0;
        }
    }
                if (toggleSwitch3.checked) {
        if(start==1){
          swinput[4] = 1;
       }
    } else {
        if(start==1){
          swinput[4] = 0;
        }
    }
                if (toggleSwitch2.checked) {
        if(start==1){
          swinput[5] = 1;
       }
    } else {
        if(start==1){
          swinput[5] = 0;
        }
    }
                                if (toggleSwitch1.checked) {
        if(start==1){
          swinput[6] = 1;
       }
    } else {
        if(start==1){
          swinput[6] = 0;
        }
    }
                                                if (toggleSwitch0.checked) {
        if(start==1){
          swinput[7] = 1;
       }
    } else {
        if(start==1){
          swinput[7] = 0;
        }
    }
    socket.emit('sw',{

        data:swinput,
        cid:cid
    });
//发送数据
}




function startsim(){
  start=1;
  $("bstop").disabled=false;
  $("bstart").disabled=true;
        socket.emit('startt',{

        data:start,
        cid:cid
    });
}

function resetsw(){
          var toggleSwitch0 = document.getElementById('Switch0');
    var toggleSwitch1 = document.getElementById('Switch1');
    var toggleSwitch2 = document.getElementById('Switch2');
    var toggleSwitch3 = document.getElementById('Switch3');
    var toggleSwitch4 = document.getElementById('Switch4');
    var toggleSwitch5 = document.getElementById('Switch5');
    var toggleSwitch6 = document.getElementById('Switch6');
    var toggleSwitch7 = document.getElementById('Switch7');
    toggleSwitch0.checked=0;
    toggleSwitch1.checked=0;
    toggleSwitch2.checked=0;
    toggleSwitch3.checked=0;
    toggleSwitch4.checked=0;
    toggleSwitch5.checked=0;
    toggleSwitch6.checked=0;
    toggleSwitch7.checked=0;




}


function stopsim(){
  start=0;

    resetledseg();
    resetsw();
  $("bstart").disabled=false;
  $("bstop").disabled=true;
          socket.emit('startt',{

        data:start,
        cid:cid
    });
}
function quitsim(){
        $("bstart").disabled=false;
  $("bstop").disabled=true;
          socket.emit('quit',{
        data:1,
        cid:cid
    });
    resetledseg();
        resetsw();

}









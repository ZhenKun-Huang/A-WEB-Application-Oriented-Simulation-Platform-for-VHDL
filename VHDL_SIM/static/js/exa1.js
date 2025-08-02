let tid
        socket.on('receive_sid',function (data){
            tid=data
        })
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
function $(id){ return document.getElementById(id); }
function resetledseg1(){

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


function start1sim(){
  start=1;
  $("bstop1").disabled=false;
  $("bstart1").disabled=true;
        socket.emit('startt1',{

        data:start,
        cid:tid
    });
}
function stop1sim(){
  start=0;

  $("bstart1").disabled=false;
  $("bstop1").disabled=true;
          socket.emit('startt1',{

        data:start,
        cid:tid
    });
    resetledseg1();
    resetsw();
}

function vhdup1(){
vhdlUpdate("--可以用sw开关控制led\n" +
    "--数码管自增显示，按下btn3后归零\n" +
    "\n" +
    "library ieee;\n" +
    "use ieee.std_logic_1164.all;\n" +
    "use ieee.numeric_std.all;\n" +
    "\n" +
    "entity test is\n" +
    "port (\n" +
    "  clk: in std_logic; \n" +
    "  btn: in std_logic_vector(3 downto 0);\n" +
    "  sw: in std_logic_vector(7 downto 0);\n" +
    "  led: out std_logic_vector(7 downto 0);\n" +
    "  seg0: out std_logic_vector(6 downto 0);\n" +
    "  seg1: out std_logic_vector(6 downto 0));\n" +
    "end test;\n" +
    "\n" +
    "architecture description of test is\n" +
    "  signal counterclk: integer range 0 to 255;\n" +
    "  signal counter: unsigned(7 downto 0):=x\"00\";\n" +
    "  signal clk1: std_logic:='0';\n" +
    "\n" +
    "  function dec7seg(val: unsigned(3 downto 0)) return std_logic_vector is\n" +
    "  begin\n" +
    "    case val is\n" +
    "      when \"0000\"=> return \"1111110\"; --0\n" +
    "      when \"0001\"=> return \"0110000\"; --1\n" +
    "      when \"0010\"=> return \"1101101\"; --2\n" +
    "      when \"0011\"=> return \"1111001\"; --3\n" +
    "      when \"0100\"=> return \"0110011\"; --4\n" +
    "      when \"0101\"=> return \"1011011\"; --5\n" +
    "      when \"0110\"=> return \"1011111\"; --6\n" +
    "      when \"0111\"=> return \"1110000\"; --7\n" +
    "      when \"1000\"=> return \"1111111\"; --8\n" +
    "      when \"1001\"=> return \"1111011\"; --9\n" +
    "      when \"1010\"=> return \"1110111\"; --A\n" +
    "      when \"1011\"=> return \"0011111\"; --B\n" +
    "      when \"1100\"=> return \"1001110\"; --C\n" +
    "      when \"1101\"=> return \"0111101\"; --D\n" +
    "      when \"1110\"=> return \"1001111\"; --E\n" +
    "      when \"1111\"=> return \"1000111\"; --F\n" +
    "      when others=> return \"1111111\"; ---\n" +
    "    end case;\n" +
    "  end function;\n" +
    "\n" +
    "begin\n" +
    "\n" +
    "  led <= sw;\n" +
    "  seg1<=dec7seg(counter(7 downto 4));\n" +
    "  seg0<=dec7seg(counter(3 downto 0));\n" +
    "\n" +
    "  process(clk1)\n" +
    "  begin\n" +
    "    if (clk1'event and clk1='1') then\n" +
    "          counter<=counter+1;\n" +
    "    if btn=\"1000\" then\n" +
    "          counter<=\"00000000\";\n" +
    "    end if;\n" +
    "    end if;\n" +
    "  end process;\n" +
    "\n" +
    "  process(clk)\n" +
    "  begin\n" +
    "    if (clk='1') then \n" +
    "      if (counterclk<4) then \n" +
    "        counterclk<=counterclk+1;\n" +
    "      else\n" +
    "        counterclk<=0;\n" +
    "        clk1<=not clk1;\n" +
    "      end if;\n" +
    "    end if;\n" +
    "  end process;\n" +
    "\n" +
    "  \n" +
    "end description;",false)

}
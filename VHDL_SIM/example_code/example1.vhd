
library ieee;
use ieee.std_logic_1164.all;
use ieee.numeric_std.all;

entity test is
port (
  clk: in std_logic;
  btn: in std_logic_vector(3 downto 0);
  sw: in std_logic_vector(7 downto 0);
  led: out std_logic_vector(7 downto 0);
  seg0: out std_logic_vector(6 downto 0);
  seg1: out std_logic_vector(6 downto 0));
end test;

architecture description of test is
  signal counterclk: integer range 0 to 255;
  signal counter: unsigned(7 downto 0):=x"00";
  signal clk1: std_logic:='0';

  function dec7seg(val: unsigned(3 downto 0)) return std_logic_vector is
  begin
    case val is
      when "0000"=> return "1111110"; --0
      when "0001"=> return "0110000"; --1
      when "0010"=> return "1101101"; --2
      when "0011"=> return "1111001"; --3
      when "0100"=> return "0110011"; --4
      when "0101"=> return "1011011"; --5
      when "0110"=> return "1011111"; --6
      when "0111"=> return "1110000"; --7
      when "1000"=> return "1111111"; --8
      when "1001"=> return "1111011"; --9
      when "1010"=> return "1110111"; --A
      when "1011"=> return "0011111"; --B
      when "1100"=> return "1001110"; --C
      when "1101"=> return "0111101"; --D
      when "1110"=> return "1001111"; --E
      when "1111"=> return "1000111"; --F
      when others=> return "1111111"; ---
    end case;
  end function;

begin

  led <= sw;
  seg1<=dec7seg(counter(7 downto 4));
  seg0<=dec7seg(counter(3 downto 0));

  process(clk1)
  begin
    if (clk1'event and clk1='1') then
          counter<=counter+1;
    if btn="1000" then
          counter<="00000000";
    end if;
    end if;
  end process;

  process(clk)
  begin
    if (clk='1') then
      if (counterclk<4) then
        counterclk<=counterclk+1;
      else
        counterclk<=0;
        clk1<=not clk1;
      end if;
    end if;
  end process;


end description;
library ieee;
use std.textio.all;
use IEEE.numeric_std.ALL;
use ieee.std_logic_1164.all;
entity tb is
    end tb;

architecture beh of tb is   
    signal clk_tb: std_logic:='1';
    signal sw_tb: std_logic_vector(7 downto 0):="00000000";
    signal led_tb : std_logic_vector(7 downto 0) :="00000000";
    signal btn_tb : std_logic_vector(3 downto 0) :="0000";
    signal seg0_tb : std_logic_vector(6 downto 0) :="0000000";
    signal seg1_tb : std_logic_vector(6 downto 0) :="0000000";
    signal clk_find :std_logic:='1';
    constant period : time := 100 ms;
    component test
port (sw:in std_logic_vector(7 downto 0);
        clk : in std_logic;
        led:out std_logic_vector(7 downto 0);
btn:in std_logic_vector(3 downto 0);
seg0 : out std_logic_vector(6 downto 0);
seg1 : out std_logic_vector(6 downto 0)
);
        end component;
    begin
    U0: test port map(
        btn=>btn_tb,
        led=>led_tb,
	clk=>clk_tb,
	sw=>sw_tb,
	seg0=>seg0_tb,
	seg1=>seg1_tb

    );

process
variable btns        :file_open_status;
file btninput_file        :text;
variable buf            :line;
variable temp1   :bit;
begin
wait for period/8;
    file_open(btns, btninput_file, "./data/btninput.txt",read_mode);
	readline(btninput_file, buf);
	read(buf, temp1);
	btn_tb(3)<=to_stdulogic(temp1);
        read(buf,temp1);
	btn_tb(2)<=to_stdulogic(temp1);

		read(buf, temp1);
	btn_tb(1)<=to_stdulogic(temp1);
        read(buf,temp1);
	btn_tb(0)<=to_stdulogic(temp1);
	file_close(btninput_file);
end process;


process
variable fstatus        :file_open_status;
file input_file        :text;
variable buf            :line;
variable temp1   :bit;
begin
wait for period/8;
    file_open(fstatus, input_file, "./data/swinput.txt",read_mode);
	readline(input_file, buf);

		read(buf, temp1);
	sw_tb(7)<=to_stdulogic(temp1);
	read(buf,temp1);
	sw_tb(6)<=to_stdulogic(temp1);
	read(buf,temp1);
	sw_tb(5)<=to_stdulogic(temp1);
        read(buf,temp1);
	sw_tb(4)<=to_stdulogic(temp1);
	read(buf, temp1);
	sw_tb(3)<=to_stdulogic(temp1);
	read(buf,temp1);
	sw_tb(2)<=to_stdulogic(temp1);
	read(buf,temp1);
	sw_tb(1)<=to_stdulogic(temp1);
        read(buf,temp1);
	sw_tb(0)<=to_stdulogic(temp1);
	file_close(input_file);
end process;


process
	variable file_status        :file_open_status;
	variable temp2   :bit;
	FILE FILE_OUT : TEXT;
    variable buff:LINE;
begin
	wait for 3000 ns;
	file_open(file_status,FILE_OUT,"./data/record.txt",append_mode);
	temp2:=to_bit(led_tb(7));
	 write(buff,temp2);
	 wait for 3000 ns;
	 write(buff,to_bit(led_tb(6)));
	 wait for 3000 ns;
	 write(buff,to_bit(led_tb(5)));
     wait for 3000 ns;
     write(buff,to_bit(led_tb(4)));
     wait for 3000 ns;
     write(buff,to_bit(led_tb(3)));
     wait for 3000 ns;
	 write(buff,to_bit(led_tb(2)));
	 wait for 3000 ns;
	 write(buff,to_bit(led_tb(1)));
         wait for 3000 ns;
         write(buff,to_bit(led_tb(0)));
         wait for 3000 ns;
     writeline(FILE_OUT,buff);
         wait for 3000 ns;
     file_close(FILE_OUT);
end process;

process
	variable file_status        :file_open_status;
	variable temp2   :bit;
	FILE seg0out : TEXT;
    variable buff:LINE;
begin
	wait for 3000 ns;
	file_open(file_status,seg0out,"./data/seg0out.txt",append_mode);
	temp2:=to_bit(seg0_tb(6));
	 write(buff,temp2);
     wait for 3000 ns;
     write(buff,to_bit(seg0_tb(5)));
	 wait for 3000 ns;
	 write(buff,to_bit(seg0_tb(4)));
     wait for 3000 ns;
     write(buff,to_bit(seg0_tb(3)));
     wait for 3000 ns;
	 write(buff,to_bit(seg0_tb(2)));
	 wait for 3000 ns;
	 write(buff,to_bit(seg0_tb(1)));
     wait for 3000 ns;
     write(buff,to_bit(seg0_tb(0)));
     wait for 3000 ns;
     writeline(seg0out,buff);
         wait for 3000 ns;
     file_close(seg0out);
end process;

process
	variable file_status        :file_open_status;
	variable temp2   :bit;
	FILE seg1out : TEXT;
    variable buff:LINE;
begin
	wait for 3000 ns;
	file_open(file_status,seg1out,"./data/seg1out.txt",append_mode);
	temp2:=to_bit(seg1_tb(6));
	 write(buff,temp2);
     wait for 3000 ns;
     write(buff,to_bit(seg1_tb(5)));
	 wait for 3000 ns;
	 write(buff,to_bit(seg1_tb(4)));
     wait for 3000 ns;
     write(buff,to_bit(seg1_tb(3)));
     wait for 3000 ns;
	 write(buff,to_bit(seg1_tb(2)));
	 wait for 3000 ns;
	 write(buff,to_bit(seg1_tb(1)));
     wait for 3000 ns;
     write(buff,to_bit(seg1_tb(0)));
     wait for 3000 ns;
     writeline(seg1out,buff);
         wait for 3000 ns;
     file_close(seg1out);
end process;


process
begin
	clk_tb<='1';
	wait for period/2;
    clk_tb<='0';
	wait for period/2;
	end process;
  
			    
    end beh;

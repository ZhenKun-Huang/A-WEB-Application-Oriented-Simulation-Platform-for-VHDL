tim="$1"
pid_file="ghdl${tim}_pid.txt"
pid_file="ghdl${tim}_pid.txt"
    read -r pid < "$pid_file"
    kill "$pid"
    echo "Killed process with PID $pid"
    # 删除PID文件
    rm -f "$pid_file"
    rm -f *.vcd

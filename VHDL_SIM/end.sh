#!/bin/bash

# 定义变量folder_name，使用第一个参数作为标识符
folder_name="data_$1"
tim="$1"
# 清理操作：删除指定的文件夹和文件
rm -rf "$folder_name"
rm -f "tb$1.vhd"
rm -f "lee$1.vhd"
rm -f tb*.vcd

# 检查是否存在pid文件并从中读取PID
pid_file="ghdl${tim}_pid.txt"
    read -r pid < "$pid_file"
    kill "$pid"
    echo "Killed process with PID $pid"
    # 删除PID文件
    rm -f "$pid_file"
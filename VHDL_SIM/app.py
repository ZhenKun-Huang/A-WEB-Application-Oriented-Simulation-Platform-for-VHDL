import os
from os import waitpid, write
from time import sleep
from xml.etree.ElementTree import tostring
import threading
from flask import Flask, render_template
from flask_socketio import SocketIO, emit
import random
import time
from threading import Thread
from flask_session import Session
import subprocess
from flask import Flask, request, render_template_string
from flask_socketio import SocketIO, emit, join_room
from flask import Flask, copy_current_request_context
active_connections = {}



def file_exists(file_path):
    return os.path.exists(file_path)

# 创建 Flask 应用
app = Flask(__name__)
app.config['SECRET_KEY'] ='your_secret_key'
socketio = SocketIO(app,async_mode='threading');
active_users = {}  # 使用字典存储活跃用户的IP地址及其最后活动时间
user_lock = threading.Lock()  # 确保对active_users的操作是线程安全的
TIMEOUT = 300  # 用户超时时间（秒）

def cleanup_inactive_users():
    """清理非活跃用户"""
    while True:
        time.sleep(TIMEOUT)  # 根据超时时间定期清理
        now = time.time()
        with user_lock:
            inactive_ips = [ip for ip, last_active in active_users.items() if now - last_active > TIMEOUT]
            for ip in inactive_ips:
                del active_users[ip]

@app.before_request
def track_user():
    """在每次请求前执行，用来跟踪用户"""
    user_ip = request.remote_addr
    now = time.time()
    with user_lock:
        # 更新或添加用户及其最后活动时间
        active_users[user_ip] = now


visitcount="hello"
# 首页路由
@app.route('/')
def index():
    visit_count=visitcount
    with user_lock:
        visit_coun = len(active_users)
    return render_template('entry.html', visit_count=visit_coun)
@app.route('/demo')
def demo():
    return render_template('demo.html')
@app.route('/example1')
def example1():
    return render_template('exa1.html')

# WebSocket 事件：客户端连接
@socketio.on('connect')
def handle_connect():
    sid = request.sid
    active_connections[sid] = True
    socketio.emit('receive_sid', {'sid': sid}, room=sid)
    print(f"客户端 {sid} 已连接")
    global visitcount
    visitcount=sid
  # 获取当前连接的sid
    thread = threading.Thread(
        target=background_task,
        args=(app, sid)  # 关键修改点
    )
    thread.start()

    emit('server_response', {'data': 'Connected to server!'}, room=request.sid)

# WebSocket 事件：客户端断开连接
@socketio.on('disconnect')
def handle_disconnect():
    sid = request.sid
    active_connections.pop(sid, None)
    print(f"客户端 {sid} 断开连接")

@socketio.on('rid')
def handle_message6(message):
    global visitcount
    visitcount=message

@socketio.on('vhdll')
def handle_message1(message):
    sid_from_client= message.get('cid')
    data_from_client = message.get('data')
    visit_count=visitcount
    if sid_from_client is None:
        print("Error: sid_from_client is None")
    elif 'sid' not in sid_from_client:
        print("Error: 'sid' key not found in sid_from_client")
    else:
        with open(f"lee{sid_from_client['sid']}.vhd", 'w') as f:
            f.write(data_from_client)
            f.close()
        print(type(data_from_client))
        print(str(sid_from_client['sid']))
        print('上传文件写入成功')
    # 继续处理文件


@socketio.on('startt')
def handle_message20(message):
    sid_from_client= message.get('cid')
    data_from_client = message.get('data')
    start_name = "start.sh"
    end_name = "stop.sh"
    visit_count = visitcount
    if data_from_client==1:
        print(1)
        result1 = subprocess.run(["sh", start_name, str(sid_from_client['sid'])], capture_output=True, text=True)
        if result1.returncode == 0:
            socketio.emit('com', result1.stdout, room=request.sid)
            socketio.emit('comcode', 1, room=request.sid)
            print('仿真开始' + result1.stdout)
            print(request.sid)
        else:
            socketio.emit('com', result1.stderr, room=request.sid)
            socketio.emit('comcode', 0, room=request.sid)
            print('仿真失败' + result1.stderr)

    if data_from_client == 0:
        result2 = subprocess.run(["sh", end_name, str(sid_from_client['sid'])], capture_output=True, text=True)
        print('仿真结束')

@socketio.on('quit')
def handle_message21(message):
    sid_from_client= message.get('cid')
    data_from_client = message.get('data')
    end_name = "end.sh"
    if data_from_client==1:
        result2 = subprocess.run(["sh", end_name, str(sid_from_client['sid'])], capture_output=True, text=True)


@socketio.on('startt1')
def handle_message21(message):
    sid_from_client= message.get('cid')
    data_from_client = message.get('data')
    start_name = "start_example.sh"
    end_name = "stop.sh"
    visit_count = visitcount
    if data_from_client==1:


        print(1)
        result1 = subprocess.run(["sh", start_name, str(sid_from_client['sid'])], capture_output=True, text=True)
        if result1.returncode == 0:
            emit('com', result1.stdout, room=sid_from_client['sid'])
            emit('comcode', 1, room=sid_from_client['sid'])
        else:
            emit('com', result1.stderr, room=sid_from_client['sid'])
            emit('comcode', 0, room=sid_from_client['sid'])
        print('仿真开始' + result1.stdout)
    if data_from_client == 0:
        result2 = subprocess.run(["sh", end_name, str(sid_from_client['sid'])], capture_output=True, text=True)
        print('仿真结束')





btn=1
# WebSocket 事件：接收客户端消息
@socketio.on('sw')
def handle_message4(message):
    sid_from_client= message.get('cid')
    data_from_client = message.get('data')
    visit_count = visitcount
    #message是前端传来的输入，开（1）与关（0）
    with open(f"./data_{str(sid_from_client['sid'])}/swinput.txt", 'w') as f:
        for i in data_from_client:
            f.write(str(i))
        f.close()
        print('Received message:', data_from_client)
            #当buff里为1时开始把message写入input

@socketio.on('btn')
def handle_message5(message):
    sid_from_client= message.get('cid')
    data_from_client = message.get('data')
    #message是前端传来的输入，开（1）与关（0）
    with open(f"./data_{str(sid_from_client['sid'])}/btninput.txt", 'w') as f:
        for i in data_from_client:
            f.write(str(i))
        f.close()
        print('Received message:', data_from_client)
            #当buff里为1时开始把message写入input











@socketio.on('comle')
def handle_message6(message):
    sid_from_client= message.get('cid')
    data_from_client = message.get('data')
    visit_count = visitcount
    if data_from_client==1:
        if file_exists(f"./data_{str(sid_from_client['sid'])}/record.txt"):
            with open(f"./data_{str(sid_from_client['sid'])}/record.txt", 'r+', encoding='utf-8') as file:
                file.truncate(0)  # 清空文件内容，参数0表示从文件开始位置截断
            file.close()
        if file_exists(f"./data_{str(sid_from_client['sid'])}/seg0out.txt"):
            with open(f"./data_{str(sid_from_client['sid'])}/seg0out.txt", 'r+', encoding='utf-8') as file:
                file.truncate(0)  # 清空文件内容，参数0表示从文件开始位置截断
            file.close()
        if file_exists(f"./data_{str(sid_from_client['sid'])}/seg1out.txt"):
            with open(f"./data_{str(sid_from_client['sid'])}/seg1out.txt", 'r+', encoding='utf-8') as file:
                file.truncate(0)  # 清空文件内容，参数0表示从文件开始位置截断
            file.close()
        time.sleep(0.02)




def background_task(app_instance, sid):
    # 初始化变量
    led = 11111111
    seg0 = 1111111
    seg1 = 1111111
    btn = 0  # 根据实际情况初始化 btn 的值
    # 初始化上一次读取的内容
    last_led = 11111111
    last_seg0 = 1111111
    last_seg1 = 1111111
    new_led=11111111
    new_seg0 = 1111111
    new_seg1 = 1111111

    while True:
        with app_instance.app_context():
            updated = False  # 标记是否有任何文件内容更新

            # 检查并读取 record.txt 文件
            if os.path.exists(f"./data_{str(sid)}/record.txt"):
                with open(f"./data_{str(sid)}/record.txt", 'r', encoding='utf-8') as file1:
                    new_led = file1.readline().strip()
                if new_led =='':
                    new_led =last_led
                if new_led != last_led:  # 如果内容有变化
                    led = new_led
                    last_led = new_led
                    updated = True



            # 检查并读取 seg0out.txt 文件
            if os.path.exists(f"./data_{str(sid)}/seg0out.txt"):
                with open(f"./data_{str(sid)}/seg0out.txt", 'r', encoding='utf-8') as file2:
                    new_seg0 = file2.readline().strip()
                if new_seg0 =='':
                    new_seg0 =last_seg0
                if new_seg0 != last_seg0:  # 如果内容有变化
                    seg0 = new_seg0
                    last_seg0 = new_seg0
                    updated = True


            # 检查并读取 seg1out.txt 文件
            if os.path.exists(f"./data_{str(sid)}/seg1out.txt"):
                with open(f"./data_{str(sid)}/seg1out.txt", 'r', encoding='utf-8') as file3:
                    new_seg1 = file3.readline().strip()
                if new_seg1 =='':
                    new_seg1 =last_seg1
                if new_seg1 != last_seg1:  # 如果内容有变化
                    seg1 = new_seg1
                    last_seg1 = new_seg1
                    updated = True
            # 只有当有任何文件内容更新时，才构建数据字典并通过 Socket.IO 发送
            if updated== True:
                data = {
                    'sales': new_led,
                    'orders': btn,  # 确保 btn 已正确赋值
                    'timestamp': time.strftime('%Y-%m-%d %H:%M:%S'),  # 更改时间格式以适应标准格式
                    'seg0': new_seg0,
                    'seg1': new_seg1,
                    'yesorno':1
                }
                socketio.emit('update_data', data, room=sid)
                sleep(0.05)
            if updated==0:
                data = {
                    'sales': new_led,
                    'orders': btn,  # 确保 btn 已正确赋值
                    'timestamp': time.strftime('%Y-%m-%d %H:%M:%S'),  # 更改时间格式以适应标准格式
                    'seg0': new_seg0,
                    'seg1': new_seg1,
                    'yesorno':0
                }
                socketio.emit('update_data', data, room=sid)
                sleep(0.02)




# 主函数：启动应用
if __name__ == '__main__':
    # 启动后台线程
    # 启动 Flask-SocketIO 服务
    socketio.run(app, debug=True, host='0.0.0.0', port=8080,allow_unsafe_werkzeug=True)
    cleanup_thread = threading.Thread(target=cleanup_inactive_users)
    cleanup_thread.daemon = True
    cleanup_thread.start()
    app.run(debug=True)

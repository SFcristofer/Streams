import paramiko
import sys

def run_remote_cmd(host, user, password, command):
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        client.connect(host, username=user, password=password)
        # Use sudo -S if the command starts with sudo
        if command.startswith("sudo"):
            command = command.replace("sudo ", "sudo -S ", 1)
            stdin, stdout, stderr = client.exec_command(command)
            stdin.write(password + "\n")
            stdin.flush()
        else:
            stdin, stdout, stderr = client.exec_command(command)
        
        # Capture outputs
        out = stdout.read().decode()
        err = stderr.read().decode()
        
        # recv_exit_status might block, so we wait for the command to finish
        exit_status = stdout.channel.recv_exit_status()
        
        print(out)
        print(err, file=sys.stderr)
        return exit_status
    finally:
        client.close()

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python remote_cmd.py <command>")
        sys.exit(1)
    
    command = sys.argv[1]
    host = "192.168.100.24"
    user = "cristofer"
    password = "faker1"
    
    sys.exit(run_remote_cmd(host, user, password, command))

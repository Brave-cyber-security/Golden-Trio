# vulnerable_ping.py
import os

def ping_host(ip):
    # XAVFLI USUL! To'g'ridan-to'g'ri foydalanuvchi kiritgan ma'lumot ishlatilmoqda
    command = f"ping -c 4 {ip}"
    result = os.system(command)
    return "Ping tugadi!"

# Test qilib ko'rish uchun
if __name__ == "__main__":
    user_input = input("Ping qilmoqchi bo'lgan IP: ")
    print(ping_host(user_input))

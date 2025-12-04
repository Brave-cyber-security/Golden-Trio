# vulnerable_app.py
from flask import Flask, request, render_template_string
import sqlite3

app = Flask(__name__)

# Ma'lumotlar bazasini yaratamiz (bir marta ishlaydi)
def init_db():
    conn = sqlite3.connect('users.db')
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS users 
                 (id INTEGER PRIMARY KEY, username TEXT, password TEXT, role TEXT)''')
    # Test foydalanuvchilar
    c.execute("DELETE FROM users")  # har safar toza bo'lsin
    c.execute("INSERT INTO users (username, password, role) VALUES ('admin', 'S3cRe7P@ss!', 'administrator')")
    c.execute("INSERT INTO users (username, password, role) VALUES ('john', '123456', 'user')")
    c.execute("INSERT INTO users (username, password, role) VALUES ('alice', 'qwerty', 'moderator')")
    conn.commit()
    conn.close()

init_db()

# HTML shablon
LOGIN_PAGE = '''
<h1>Login Panel</h1>
<form method="POST">
    Username: <input name="username"><br><br>
    Password: <input name="password" type="password"><br><br>
    <input type="submit" value="Kirish">
</form>
<br>
{% if message %}
    <h3 style="color:red;">{{ message }}</h3>
{% endif %}
'''

@app.route('/', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        # XAVFLI SQL INJECTION JOYI!
        query = f"SELECT * FROM users WHERE username = '{username}' AND password = '{password}'"
        print(f"[!] Ishlatilgan query: {query}")  # Terminalda ko'rinadi

        conn = sqlite3.connect('users.db')
        c = conn.cursor()
        c.execute(query)
        user = c.fetchone()
        conn.close()

        if user:
            return f"<h2 style='color:green;'>Muvaffaqiyatli kirdingiz, {user[1]}! Sizning rolingiz: {user[3]}</h2>"
        else:
            return render_template_string(LOGIN_PAGE, message="Noto'g'ri login yoki parol!")

    return render_template_string(LOGIN_PAGE, message="")

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

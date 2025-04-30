import sqlite3
import os
import bcrypt


def create_user_database():
    os.makedirs(f'{os.getcwd()}/databases/sql', exist_ok=True)

    with sqlite3.connect(f'{os.getcwd()}/databases/sql/users.db') as conn:
        cursor = conn.cursor()
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS user_info (
            Username TEXT PRIMARY KEY,
            Password TEXT
        )
        ''')


def add_user(username, password):
    hashed_pw = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    with sqlite3.connect(f'{os.getcwd()}/databases/sql/users.db') as conn:
        cursor = conn.cursor()
        try:
            cursor.execute('INSERT INTO user_info (Username, Password) VALUES (?, ?)', (username, hashed_pw))
            conn.commit()
            return True
        except sqlite3.IntegrityError:
            return False


def verify_user(username, password):
    with sqlite3.connect(f'{os.getcwd()}/databases/sql/users.db') as conn:
        cursor = conn.cursor()
        cursor.execute('SELECT Password FROM user_info WHERE Username = ?', (username,))
        result = cursor.fetchone()

        if result:
            stored_hash = result[0]
            # Ensure stored_hash is bytes; decode if it's still a string (SQLite may store as TEXT)
            if isinstance(stored_hash, str):
                stored_hash = stored_hash.encode('utf-8')
            return bcrypt.checkpw(password.encode('utf-8'), stored_hash)
        else:
            return False

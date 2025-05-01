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
            Password TEXT,
            Styled_Username TEXT,
            API_Key TEXT
        )
        ''')


def add_user(username, password, api_key):
    hashed_pw = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    with sqlite3.connect(f'{os.getcwd()}/databases/sql/users.db') as conn:
        cursor = conn.cursor()
        try:
            cursor.execute('INSERT INTO user_info (Username, Password, Styled_Username, API_Key) VALUES (?, ?, ?, ?)', (username.lower(), hashed_pw, username, api_key))
            conn.commit()
            return True
        except sqlite3.IntegrityError:
            return False


def verify_user(username, password):
    with sqlite3.connect(f'{os.getcwd()}/databases/sql/users.db') as conn:
        cursor = conn.cursor()
        cursor.execute('SELECT Password FROM user_info WHERE Username = ?', (username.lower(),))
        result = cursor.fetchone()

        if result:
            stored_hash = result[0]
            # Ensure stored_hash is bytes; decode if it's still a string (SQLite may store as TEXT)
            if isinstance(stored_hash, str):
                stored_hash = stored_hash.encode('utf-8')
            return bcrypt.checkpw(password.encode('utf-8'), stored_hash)
        else:
            return False

def fetch_api_key(username):
    with sqlite3.connect(f'{os.getcwd()}/databases/sql/users.db') as conn:
        cursor = conn.cursor()
        cursor.execute('SELECT API_Key FROM user_info WHERE Username = ?', (username.lower(),))
        result = cursor.fetchone()

        if result:
            return result[0]
        else:
            return None

def change_password(username, new_password):

    # Hash the new password
    new_hashed_pw = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt())

    # Update the password in the database
    with sqlite3.connect(f'{os.getcwd()}/databases/sql/users.db') as conn:
        cursor = conn.cursor()
        cursor.execute('UPDATE user_info SET Password = ? WHERE Username = ?', (new_hashed_pw, username.lower()))
        conn.commit()
        return True

def change_api_key(username, new_api_key):
    # Update the API key in the database
    with sqlite3.connect(f'{os.getcwd()}/databases/sql/users.db') as conn:
        cursor = conn.cursor()
        cursor.execute('UPDATE user_info SET API_Key = ? WHERE Username = ?', (new_api_key, username.lower()))
        conn.commit()
        return True

def fetch_styled_username(username):
    with sqlite3.connect(f'{os.getcwd()}/databases/sql/users.db') as conn:
        cursor = conn.cursor()
        cursor.execute('SELECT Styled_Username FROM user_info WHERE Username = ?', (username.lower(),))
        result = cursor.fetchone()

        if result:
            return result[0]
        else:
            return None

def fetch_username_by_api_key(api_key):
    with sqlite3.connect(f'{os.getcwd()}/databases/sql/users.db') as conn:
        cursor = conn.cursor()
        cursor.execute('SELECT Username FROM user_info WHERE API_Key = ?', (api_key,))
        result = cursor.fetchone()

        if result:
            return result[0]  # Return the username
        else:
            return None  # If no user is found for the API key
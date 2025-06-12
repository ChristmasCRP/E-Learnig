import firebase_admin
from firebase_admin import credentials, firestore

credentials_path = "app/credentials/firebase_credentials.json"

try:
    cred = credentials.Certificate(credentials_path)
    firebase_admin.initialize_app(cred)
    db = firestore.client()
    print("Połączenie z Firebase nawiązane pomyślnie.")
except Exception as e:
    print("!!!!!!!!!!!!!!!!!!!!!!!!!!ess!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
    print("Nie udało się połączyć z Firebase.")
    print(f"Szczegóły błędu: {e}")
    print("!!!!!!!!!!!!!!!!!!!!!!!!!!!ess!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
    raise e
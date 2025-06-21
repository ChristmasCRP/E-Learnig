import firebase_admin
from firebase_admin import credentials, firestore
import os
import json
import base64

# Zmienna do przechowywania obiektu z danymi uwierzytelniającymi
cred_object = None

# Nazwa zmiennej środowiskowej, której szukamy na Vercel
firebase_env_var_name = 'FIREBASE_ADMIN_CONFIG_BASE64'

# KROK 1: Sprawdzamy, czy aplikacja działa na Vercel (czy zmienna środowiskowa istnieje)
if firebase_env_var_name in os.environ:
    print("Znaleziono konfigurację Firebase w zmiennych środowiskowych. Inicjalizacja z Base64...")
    
    # Odczytujemy zakodowaną zmienną
    service_account_b64 = os.environ.get(firebase_env_var_name)
    
    # Dekodujemy Base64 do stringa z formatem JSON
    service_account_json_str = base64.b64decode(service_account_b64).decode('utf-8')
    
    # Parsujemy string JSON do słownika (dictionary) w Pythonie
    cred_object = json.loads(service_account_json_str)

else:
    # Jesteśmy lokalnie, więc wczytujemy z pliku
    print("Nie znaleziono konfiguracji w zmiennych środowiskowych. Inicjalizacja z pliku lokalnego...")
    
    # Ścieżka do Twojego pliku. Pamiętaj, aby był w .gitignore!
    credentials_path = "app/credentials/firebase_credentials.json"
    cred_object = credentials_path


# KROK 2: Inicjalizujemy Firebase, używając przygotowanego obiektu
try:
    # Sprawdzamy, czy aplikacja nie została już zainicjowana
    if not firebase_admin._apps:
        cred = credentials.Certificate(cred_object)
        firebase_admin.initialize_app(cred)
    
    db = firestore.client()
    print("Połączenie z Firebase nawiązane pomyślnie.")

except Exception as e:
    # Twój kod obsługi błędów pozostaje taki sam
    print("!!!!!!!!!!!!!!!!!!!!!!!!!!ess!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
    print("Nie udało się połączyć z Firebase.")
    print(f"Szczegóły błędu: {e}")
    print("!!!!!!!!!!!!!!!!!!!!!!!!!!!ess!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
    raise e
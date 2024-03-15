with open('path-to-delegates.txt', 'r', encoding='utf-8') as file:
    lines = file.readlines()

for line in lines:
    line = line.strip()
    if line:
        name, credentials = line.rsplit(' ', 1)
        credentials = credentials[1:-1]
        print(f"{{ name: '{name}', credentials: '{credentials}' }},")
import os
import glob
import re

store_dir = r"C:\Users\Lenovo\Documents\THAI-GLOCAL\frontend\src\store"
files = glob.glob(os.path.join(store_dir, "*.ts"))

booking_functions = [
    "fetchBookings", "addBooking", "cancelBooking", "requestCancellation",
    "approveCancellation", "rejectCancellation",
    "updateBookingStatus", "createMockBooking"
]

def add_mock(content):
    for func in booking_functions:
        # Match `func: async (...) => {`
        pattern = re.compile(rf'(\n\s+)({func}:\s*async\s*\([^)]*\)\s*=>\s*\{{)')
        def repl(m):
            indent = m.group(1)
            decl = m.group(2)
            # Only add if not already there
            # (We cannot easily know with regex if it's there but we just replace directly)
            inject = f"{indent}  console.warn('Feature Coming Soon');{indent}  alert('Feature Coming Soon');{indent}  return;"
            return f"{indent}{decl}{inject}"
        
        # Apply replacement only if not previously added
        if "'Feature Coming Soon'" not in content or not re.search(rf'{func}:\s*async\s*\([^)]*\)\s*=>\s*\{{\s*console\.warn', content):
            content = pattern.sub(repl, content)
    return content

for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    original_content = content
    
    # Add mocks for booking functions
    if "bookingStore.ts" in file or "myCenterStore.ts" in file:
        content = add_mock(content)
        
    # Method Swap: put to patch
    content = content.replace("apiClient.put(", "apiClient.patch(")
    
    # URL Alignment
    # Center updates/deletes -> /client/centers/update/${id} or /client/centers/delete/${id}
    # from adminStore.ts
    content = re.sub(r'`/api/admin/centers/\$\{(.*?)\}`', lambda m: f'`/client/centers/update/${{{m.group(1)}}}`' if 'patch' in content[m.start()-30:m.start()] else f'`/client/centers/delete/${{{m.group(1)}}}`', content)
    
    # from myCenterStore.ts centers
    # apiClient.patch(`/api/my-centers/centers/${id}`, data); -> /client/centers/update/${id}
    # apiClient.delete(`/api/my-centers/centers/${id}`); -> /client/centers/delete/${id}
    content = re.sub(r'apiClient\.patch\(`(?:/api/my-centers|/api/admin)/centers/\$\{(.*?)\}`', r'apiClient.patch(`/client/centers/update/${\1}`', content)
    content = re.sub(r'apiClient\.patch\(`(?:/api/my-centers|/api/admin)/centers/\$\{(.*?)\}/status`', r'apiClient.patch(`/client/centers/update/${\1}`', content)
    content = re.sub(r'apiClient\.delete\(`(?:/api/my-centers|/api/admin)/centers/\$\{(.*?)\}`', r'apiClient.delete(`/client/centers/delete/${\1}`', content)
    
    # Workshops
    # apiClient.patch(`/api/my-centers/workshops/${id}`, data);
    content = re.sub(r'apiClient\.patch\(`(?:/api/my-centers|/api/admin)/workshops/\$\{(.*?)\}`', r'apiClient.patch(`/client/workshops/update/${\1}`', content)
    content = re.sub(r'apiClient\.delete\(`(?:/api/my-centers|/api/admin)/workshops/\$\{(.*?)\}`', r'apiClient.delete(`/client/workshops/delete/${\1}`', content)
    
    # Sessions -> Activities
    # apiClient.patch(`/api/my-centers/sessions/${id}`, data);
    content = re.sub(r'apiClient\.patch\(`(?:/api/my-centers|/api/admin)/sessions/\$\{(.*?)\}`', r'apiClient.patch(`/api/activities/update/${\1}`', content)
    content = re.sub(r'apiClient\.delete\(`(?:/api/my-centers|/api/admin)/sessions/\$\{(.*?)\}`', r'apiClient.delete(`/api/activities/delete/${\1}`', content)
    
    # Cleanup remaining /api/my-centers/
    # endpoints like GET `/api/my-centers/centers` -> `/client/centers`
    content = re.sub(r'`(?:/api/my-centers)/centers`', r'`/client/centers`', content)
    content = re.sub(r'`(?:/api/my-centers)/centers/\$\{(.*?)\}/workshops`', r'`/client/workshops/center/${\1}`', content) # not specified, maybe just /client/workshops ? Wait, the rule says: replace `/api/my-centers/centers` with `/client/centers`, etc. Also replace `/api/my-centers/bookings/...` with `/api/bookings/...`.
    content = re.sub(r'`(?:/api/my-centers)/bookings', r'`/api/bookings', content)

    # Cleanup remaining /api/my-centers that don't match bookings, center, etc.
    # What others are there?
    content = re.sub(r'/api/my-centers/workshops', '/client/workshops', content)
    content = re.sub(r'/api/my-centers/sessions', '/api/activities', content)

    if content != original_content:
        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {file}")

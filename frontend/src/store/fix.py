import re

def fix_file(file):
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    content = content.replace('patch(/client/admin/users/role/, {', 'patch(/client/admin/users/role/, {')
    content = content.replace('patch(/client/admin/users/, { status })', 'patch(/client/admin/users/, { status })')
    content = content.replace('patch(/client/admin/users/, data)', 'patch(/client/admin/users/, data)')
    content = content.replace('patch(/client/centers/update/, data)', 'patch(/client/centers/update/, data)')
    content = content.replace('delete(/client/centers/delete/)', 'delete(/client/centers/delete/)')
    
    content = content.replace('patch(/client/centers/update/, data)', 'patch(/client/centers/update/, data)')
    content = content.replace('delete(/client/centers/delete/)', 'delete(/client/centers/delete/)')
    content = content.replace('patch(/client/workshops/update/, data)', 'patch(/client/workshops/update/, data)')
    content = content.replace('delete(/client/workshops/delete/)', 'delete(/client/workshops/delete/)')
    content = content.replace('patch(/api/activities/update/, data)', 'patch(/api/activities/update/, data)')
    content = content.replace('delete(/api/activities/delete/)', 'delete(/api/activities/delete/)')
    
    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)

fix_file('adminStore.ts')
fix_file('myCenterStore.ts')

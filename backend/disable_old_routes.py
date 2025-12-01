#!/usr/bin/env python3
"""
Script to disable old ingredient routes in app.py
Adds clear markers and comments out conflicting routes
"""

def disable_old_routes():
    """Comment out old ingredient routes that conflict with ingredients_api.py blueprint"""
    
    # Read the file
    with open('app.py', 'r') as f:
        lines = f.readlines()
    
    # Section 1: Lines 128-380 (Routes 1-5: GET, GET single, POST, PUT, DELETE)
    section1_start = 127  # Line 128 in 0-indexed
    section1_end = 379    # Line 380 in 0-indexed
    
    # Section 2: Lines 1803-1900 (Routes 6-7: Template, Import)
    section2_start = 1802  # Line 1803 in 0-indexed
    section2_end = 1899    # Line 1900 in 0-indexed
    
    # Create new lines list
    new_lines = []
    
    # Process line by line
    for i, line in enumerate(lines):
        # Add marker before section 1
        if i == section1_start:
            new_lines.append("\n")
            new_lines.append("# " + "="*76 + "\n")
            new_lines.append("# OLD INGREDIENT ROUTES - DISABLED (Replaced by ingredients_api.py)\n")
            new_lines.append("# These routes conflict with the new blueprint and use old schema\n")
            new_lines.append("# DO NOT UNCOMMENT - Use ingredients_api.py instead\n")
            new_lines.append("# " + "="*76 + "\n")
            new_lines.append("# COMMENTED OUT: Lines 128-380 (5 routes)\n")
            new_lines.append("# " + "="*76 + "\n")
        
        # Comment out section 1
        if section1_start <= i <= section1_end:
            if line.strip() and not line.strip().startswith('#'):
                new_lines.append('# ' + line)
            else:
                new_lines.append(line)
        
        # Add marker before section 2
        elif i == section2_start:
            new_lines.append("\n")
            new_lines.append("# " + "="*76 + "\n")
            new_lines.append("# OLD INGREDIENT IMPORT ROUTES - DISABLED\n")
            new_lines.append("# These routes use old schema - replaced by ingredients_api.py\n")
            new_lines.append("# " + "="*76 + "\n")
            new_lines.append("# COMMENTED OUT: Lines 1803-1900 (2 routes)\n")
            new_lines.append("# " + "="*76 + "\n")
        
        # Comment out section 2
        elif section2_start <= i <= section2_end:
            if line.strip() and not line.strip().startswith('#'):
                new_lines.append('# ' + line)
            else:
                new_lines.append(line)
        
        # Keep everything else as-is
        else:
            new_lines.append(line)
    
    # Write back to file
    with open('app.py', 'w') as f:
        f.writelines(new_lines)
    
    print("✅ Successfully disabled old ingredient routes!")
    print("\nChanges made:")
    print("  • Lines 128-380: Commented out 5 CRUD routes")
    print("  • Lines 1803-1900: Commented out 2 import routes")
    print("  • Added clear section markers")
    print("\nBackup saved as: app.py.backup_before_switchover")
    print("\nNext steps:")
    print("  1. Restart backend: sudo systemctl restart swati-soaps-backend")
    print("  2. Test frontend: Should now show ingredients!")
    print("  3. If needed, restore: cp app.py.backup_before_switchover app.py")

if __name__ == '__main__':
    disable_old_routes()

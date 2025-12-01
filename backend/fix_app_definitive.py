#!/usr/bin/env python3
"""
DEFINITIVE FIX - Based on exact line analysis
Comment out lines 1933-1974: Old formulations template route body
Keep line 1975+: Working import-excel route
"""

def fix_definitive():
    with open('app.py', 'r') as f:
        lines = f.readlines()
    
    new_lines = []
    
    for i, line in enumerate(lines, 1):
        # Lines 1933-1974: Uncommented body of old template route
        if 1933 <= i <= 1974:
            if line.strip() and not line.strip().startswith('#'):
                new_lines.append('# ' + line)
            else:
                new_lines.append(line)
        else:
            # Keep everything else as-is
            new_lines.append(line)
    
    with open('app.py', 'w') as f:
        f.writelines(new_lines)
    
    print("✅ DEFINITIVE FIX APPLIED!")
    print("\nCommented out:")
    print("  • Lines 1933-1974: Old formulations template route body")
    print("\nPreserved:")
    print("  • Lines 1-1932: All earlier code")
    print("  • Line 1975+: Working import-excel route")
    print("\n🚀 Backend should now start successfully!")
    print("\nNext: python app.py")

if __name__ == '__main__':
    fix_definitive()

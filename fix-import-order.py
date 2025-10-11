#!/usr/bin/env python3

import os
import re
from pathlib import Path

def fix_import_order(file_path):
    """Fix import order in group index files"""
    with open(file_path, 'r') as f:
        content = f.read()

    # Check if file has the corrupted pattern
    if not re.search(r'import type\s*\{[^}]*\n\n//\s*CSS animations', content):
        return False  # File is fine

    # Extract all CSS imports
    css_imports = re.findall(r'(^import \{[^}]+\} from \'\./css/[^\']+\'\n)', content, re.MULTILINE)

    # Remove CSS imports from their current location
    for css_import in css_imports:
        content = content.replace(css_import, '')

    # Remove the "// CSS animations" comment if it's orphaned
    content = re.sub(r'\n\n// CSS animations\n+', '\n', content)

    # Find the position after the last framer import or after the type imports
    framer_imports = list(re.finditer(r'^import \{[^}]+\} from \'\./framer/[^\']+\'\n', content, re.MULTILINE))

    if framer_imports:
        # Insert CSS imports after the last framer import
        last_framer = framer_imports[-1]
        insert_pos = last_framer.end()
        content = (
            content[:insert_pos] +
            "\n// CSS animations\n" +
            ''.join(css_imports) +
            content[insert_pos:]
        )
    else:
        # Insert CSS imports after type imports
        type_import_match = re.search(r'^import type .*?from [^\n]+\n', content, re.MULTILINE)
        if type_import_match:
            insert_pos = type_import_match.end()
            content = (
                content[:insert_pos] +
                "\n// CSS animations\n" +
                ''.join(css_imports) +
                content[insert_pos:]
            )

    with open(file_path, 'w') as f:
        f.write(content)

    return True

def main():
    print("Fixing import order in group index files...")
    fixed_count = 0

    # Find all group index files
    for group_dir in Path('src/components').rglob('*/*/index.ts'):
        # Skip css/ and framer/ subdirectories
        if 'css' in group_dir.parts or 'framer' in group_dir.parts:
            continue

        # Skip category-level index files
        if len(group_dir.parts) == 4:  # src/components/category/index.ts
            continue

        if fix_import_order(str(group_dir)):
            print(f"  Fixed: {group_dir}")
            fixed_count += 1

    print(f"\nFixed {fixed_count} files")

if __name__ == "__main__":
    main()

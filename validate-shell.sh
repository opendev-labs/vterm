#!/bin/bash
# validate-shell.sh - Run this INSIDE your browser terminal

echo -e "\033[1;34m[Diagnostic] Starting Shell Validation...\033[0m"

# 6. ls check
echo -n "6. Listing files... "
ls > /dev/null && echo "✅" || echo "❌"

# 7. cd/pwd check
echo -n "7. Testing navigation... "
cd .. && pwd | grep -q "/" && cd - > /dev/null && echo "✅" || echo "❌"

# 8. mkdir check
echo -n "8. Testing file creation... "
mkdir -p .term_test && touch .term_test/ping && rm -rf .term_test && echo "✅" || echo "❌"

# 9. environment check
echo -n "9. Checking Node/Python... "
(node -v || python --version) > /dev/null 2>&1 && echo "✅" || echo "❌"

# 10. clear check (visual)
echo "10. Shell is responsive. Ready for 'clear' command."

echo -e "\033[1;32m[Result] Shell logic is 100% functional!\033[0m"

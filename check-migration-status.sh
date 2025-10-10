#!/bin/bash

# Script to check CSS to Framer Motion migration status
# Validates that migrated files properly removed @keyframes

set -e

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}======================================${NC}"
echo -e "${BLUE}CSS to Framer Motion Migration Status${NC}"
echo -e "${BLUE}======================================${NC}"
echo ""

# Count files with @keyframes
TOTAL_KEYFRAMES=$(find src/components -name "*.css" -exec grep -l "@keyframes" {} \; 2>/dev/null | wc -l | tr -d ' ')

# Count files tagged with 'framer'
TOTAL_FRAMER=$(find src/components -name "*.tsx" -exec grep -l "tags: \['framer'\]" {} \; 2>/dev/null | wc -l | tr -d ' ')

# Count files tagged with 'css'
TOTAL_CSS=$(find src/components -name "*.tsx" -exec grep -l "tags: \['css'\]" {} \; 2>/dev/null | wc -l | tr -d ' ')

# Total animations (assuming every .tsx with metadata)
TOTAL_FILES=$((TOTAL_KEYFRAMES + TOTAL_FRAMER))

# Calculate percentage
if [ "$TOTAL_FILES" -gt 0 ]; then
  PERCENT_COMPLETE=$(echo "scale=1; ($TOTAL_FRAMER * 100) / $TOTAL_FILES" | bc)
else
  PERCENT_COMPLETE=0
fi

echo -e "${GREEN}✅ Migrated to Framer Motion: $TOTAL_FRAMER files${NC}"
echo -e "${YELLOW}🔄 Still using CSS @keyframes: $TOTAL_KEYFRAMES files${NC}"
echo -e "${BLUE}📊 Progress: $PERCENT_COMPLETE% complete${NC}"
echo ""

# List migrated files
echo -e "${GREEN}Migrated Files (using Framer Motion):${NC}"
find src/components -name "*.tsx" -exec grep -l "tags: \['framer'\]" {} \; 2>/dev/null | while read file; do
  basename "$file" .tsx
done | sort
echo ""

# List remaining files
echo -e "${YELLOW}Remaining Files (still using CSS @keyframes):${NC}"
find src/components -name "*.css" -exec grep -l "@keyframes" {} \; 2>/dev/null | while read file; do
  basename "$file" .css
done | sort | head -20

if [ "$TOTAL_KEYFRAMES" -gt 20 ]; then
  echo -e "${YELLOW}... and $((TOTAL_KEYFRAMES - 20)) more${NC}"
fi
echo ""

# Check for files that might be incorrectly tagged
echo -e "${BLUE}Validation Checks:${NC}"

# Find files tagged 'framer' but still have @keyframes in CSS
MISMATCHED=0
find src/components -name "*.tsx" -exec grep -l "tags: \['framer'\]" {} \; 2>/dev/null | while read tsx_file; do
  css_file="${tsx_file%.tsx}.css"
  if [ -f "$css_file" ]; then
    if grep -q "@keyframes" "$css_file" 2>/dev/null; then
      echo -e "${RED}⚠️  $(basename "$tsx_file") tagged as 'framer' but $(basename "$css_file") still has @keyframes${NC}"
      MISMATCHED=$((MISMATCHED + 1))
    fi
  fi
done

if [ "$MISMATCHED" -eq 0 ]; then
  echo -e "${GREEN}✅ No mismatched files found${NC}"
fi

echo ""
echo -e "${BLUE}======================================${NC}"
echo -e "${BLUE}Next Priority Categories:${NC}"
echo -e "${BLUE}======================================${NC}"
echo ""
echo "1. rewards/icon-animations (4 files) - Simple, high visibility"
echo "2. rewards/reward-basic (10 files) - Core animations"
echo "3. realtime/update-indicators (7 files) - User feedback"
echo ""
echo "Estimated time to complete Priority 1: ~4 hours"
echo ""
echo -e "${GREEN}For detailed migration guide, see:${NC}"
echo "  - FRAMER_MIGRATION_GUIDE.md"
echo "  - MIGRATION_STATUS.md"
echo "  - MIGRATION_SUMMARY.md"
echo ""

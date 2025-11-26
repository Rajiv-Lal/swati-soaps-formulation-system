-- Migration: Add Regulatory Approval Columns to Ingredients
-- Date: November 26, 2025
-- Purpose: Track US and EU regulatory approval status for ingredients

-- Add regulatory approval columns
ALTER TABLE ingredients 
ADD COLUMN us_approved INTEGER DEFAULT NULL,  -- NULL=Unknown, 0=No, 1=Yes
ADD COLUMN eu_approved INTEGER DEFAULT NULL;  -- NULL=Unknown, 0=No, 1=Yes

-- Add indexes for filtering
CREATE INDEX IF NOT EXISTS idx_ingredients_us_approved ON ingredients(us_approved);
CREATE INDEX IF NOT EXISTS idx_ingredients_eu_approved ON ingredients(eu_approved);

-- Add comments for documentation
-- us_approved: NULL = Unknown/Not checked, 0 = Not approved, 1 = Approved by US FDA
-- eu_approved: NULL = Unknown/Not checked, 0 = Not approved, 1 = Approved under EU Cosmetics Regulation

-- Verify the changes
SELECT 
    name,
    us_approved,
    eu_approved
FROM ingredients
LIMIT 5;

-- Migration complete
-- Note: Existing ingredients will have NULL values (unknown status)
-- Update approval status via:
-- 1. Manual UI editing
-- 2. Bulk import from Excel
-- 3. Direct SQL updates

# Database Migrations Applied

## Nov 27, 2025 - Login Fix
```sql
ALTER TABLE users ADD COLUMN is_active INTEGER DEFAULT 1;
UPDATE users SET email='admin' WHERE username='admin';
```


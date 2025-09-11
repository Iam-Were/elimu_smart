@echo off
echo Setting up PostgreSQL database for Elimu Smart...
echo.

REM Set PostgreSQL password environment variable
set PGPASSWORD=password

echo Creating database: elimu_smart_dev
"/c/Program Files/PostgreSQL/17/bin/createdb.exe" -U postgres -h localhost elimu_smart_dev

if %ERRORLEVEL% EQU 0 (
    echo ✅ Database created successfully!
    echo.
    echo Database Details:
    echo - Name: elimu_smart_dev
    echo - User: postgres  
    echo - Password: password
    echo - Host: localhost
    echo - Port: 5432
    echo.
    echo Connection string: postgres://postgres:password@localhost:5432/elimu_smart_dev
    echo.
    echo You can now start the Parse Server with: npm run dev
) else (
    echo ❌ Database creation failed
    echo.
    echo Possible solutions:
    echo 1. Make sure PostgreSQL is running: net start postgresql-x64-17
    echo 2. Try different password (check your PostgreSQL installation)
    echo 3. Check if database already exists: psql -U postgres -l
)

echo.
pause
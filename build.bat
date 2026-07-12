@echo off
echo Building ShreeNova Tech for production...

echo Building main frontend...
call npm run build
echo Main frontend built.

echo Building admin panel...
cd admin-panel
call npm run build
cd ..
echo Admin panel built.

echo.
echo Build complete!
echo dist\           - Main frontend
echo backend\        - PHP API
echo backend\admin-react\ - React Admin Panel

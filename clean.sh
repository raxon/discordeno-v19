# 👇️ delete node_modules and package-lock.json (macOS/Linux)
rm -rf node_modules
rm -f package-lock.json
rm -f yarn.lock

# 👇️ delete node_modules and package-lock.json (Windows)
rd /s /q "node_modules"
del package-lock.json
del -f yarn.lock

# 👇️ clean npm cache
npm cache clean --force

# 👇️ install packages
npm install
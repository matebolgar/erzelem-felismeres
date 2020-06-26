# Érzelem felismerés



### Előfeltételek

Node.js és a Docker program telepítve kell legyen az OS-edre

### Telepítés

Telepítsd a harmadik féltől származó könyvárakat

```
Root mappában:
npm i
```

```
cd web
npm i
```

### Action Unit-okat tartalmazó CSV kigenerálása
 
1. Indítsd el a Docker engine-t
2. Szedd le a Docker image-et és indítsd el a container-t (kis ideig eltarthat)
```
Root mappában:
docker-compose run
```

3. Helyezd a kielemezendő videót a 'raw' mappába
4. Futtasd a Node.js programot
```
Root mappában:
node index.js
```
5. Várd meg, amíg elkészül az elemezés (a kész file-ok a processed mappába kerülnek)

### Kliens program indítása
1. Indítsd el a kliens appot
```
cd web
node index.js
```
2. A file megnevezéseknek megfelelően módosítsd a "/web/index.html"-ben és a "web/public/script.js"-ben a videó és a CSV file URL-jét (Most "1.csv" és "1.mp4" van a leírva fájlokban)
3. Böngészőben nyisd meg a http://localhost:3000 oldalt
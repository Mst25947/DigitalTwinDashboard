# Digital Twin Dashboard

## 📌 Overzicht
Het **Digital Twin Dashboard** biedt een webgebaseerde interface voor het visualiseren en monitoren van digitale tweelingen.  
Deze README beschrijft zowel de **backend (Spring Boot WebFlux)** als de **frontend (Vite/React)**.

Het dashboard is opgezet als een **modulair en schaalbaar platform**, ontworpen om digitale representaties van fysieke of virtuele objecten inzichtelijk te maken. De focus ligt op het centraal tonen, analyseren en interpreteren van data binnen één webomgeving.

De repository bevat alle benodigde onderdelen voor lokale ontwikkeling, verdere uitbreiding en deployment naar een productieomgeving.  
Een belangrijk onderdeel binnen de repository is de map **`DigitalTwinDashboard`**, waarin alle broncode en deployment-scripts zijn opgenomen.

---

## 🚀 Functionaliteit
- Interactieve visualisatie van digitale-twin data in dashboards.
- Realtime of near-realtime dataverwerking via backend-services.
- Ondersteuning voor import en export van datasets (o.a. XLSX).
- Duidelijke scheiding tussen frontend (presentatie) en backend (logica en data).
- Uitbreidbaar met extra databronnen, visualisaties en functionaliteiten.
- Ontworpen met focus op onderhoudbaarheid, modulariteit en schaalbaarheid.

---

## 🏗️ Architectuur

### Backend – Spring Boot (WebFlux)
- Verantwoordelijk voor API-endpoints, businesslogica en dataverwerking.
- Asynchrone request-handling via WebFlux.
- Communiceert met de database en ontsluit data richting de frontend via REST-API’s.

### Frontend – Vite + React
- Moderne Single Page Application (SPA).
- Visualisaties via **Chart.js**.
- Webcomponenten via **Lit**.
- Routing via **Vaadin Router**.

### Database
- **H2** voor lokale ontwikkeling.
- **PostgreSQL** voor test-, runtime- en productieomgevingen.  
  De PostgreSQL database draait in een **Docker container** op de machine.

Frontend en backend communiceren via REST-API’s en blijven zelfstandig inzetbaar.

---

## 🛠️ Technologieën
- **Java 17**
- **Spring Boot 3.x (WebFlux)**
- **Maven**
- **Node.js**
- **Vite**
- **React**
- **Chart.js**
- **Lit**
- **Vaadin Router**
- **Docker & Docker Compose**
- **Nginx 1.18.0**

---

## ⚙️ Snel starten

### 1. Vereisten installeren
Zorg dat de volgende software is geïnstalleerd:
- Java 17  
- Maven (of Maven Wrapper)  
- Node.js (LTS aanbevolen)  
- Docker & Docker Compose  
- Nginx 1.18.0  

---

### 2. Starten van de machine
Nadat het **VHD-bestand** is geïmporteerd in de Azure-omgeving, zijn er doorgaans slechts minimale handelingen nodig. In de meeste gevallen start de virtuele machine correct op en is de omgeving direct klaar voor gebruik.

De backend van het Digital Twin Dashboard bevindt zich in de directory:

```plaintext
./DigitalTwinDashboard

## Runnen van database

De database draait in een Docker container via **Docker Compose**.

### Vereisten
- Docker
- Docker Compose

### Database starten
Ga naar de root van het project (waar `docker-compose.yml` staat) en voer uit:

```bash
docker compose up -d
```

Dit start een PostgreSQL database container met de volgende configuratie:

- **Database:** `twin`
- **Gebruiker:** `postgres`
- **Wachtwoord:** `postgres`
- **Poort:** `45432`
- **Container naam:** `postgres_db_twin`

### Database stoppen
```bash
docker compose down
```

### Controleren of de database draait
```bash
docker ps
```

Je zou de container `postgres_db_twin` moeten zien draaien.

### Data persistentie
De database data wordt lokaal opgeslagen in:

```
./postgres_data_twin
```

Deze map zorgt ervoor dat data behouden blijft wanneer de container opnieuw wordt gestart.

## Runnen van backend

De backend is een **Spring Boot** applicatie en draait met **Maven**.

⚠️ Zorg ervoor dat de **database draait** voordat je de backend start.

### Vereisten
- Java 17 (of hoger)
- Maven (of de meegeleverde Maven Wrapper)
- PostgreSQL database (via Docker)

### Backend starten

Ga naar de root van het project en voer uit:

#### Met Maven Wrapper (aanbevolen)
```bash
./mvnw spring-boot:run
```

Op Windows:
```bash
mvnw.cmd spring-boot:run
```

#### Met lokaal geïnstalleerde Maven
```bash
mvn spring-boot:run
```

### Alternatief: runnen vanuit IDE (IntelliJ / VS Code)

1. Open het bestand:
   ```
   src/main/java/nl/inno/digitaltwindashboard/DigitalTwinDashboardApplication.java
   ```
2. Run de `main` methode.

### Als de backend niet wil starten (fallback)

Indien de backend niet correct start via `spring-boot:run`, gebruik dan:

```bash
mvn clean package
```

Dit genereert een **SNAPSHOT JAR** in de `target` map.

Run vervolgens de backend handmatig:

```bash
java -jar target/*.jar
```

Of specifieker (indien bekend):
```bash
java -jar target/digitaltwindashboard-0.0.1-SNAPSHOT.jar
```

### Backend URL
De backend draait standaard op:

```
http://localhost:8080
```

### Controleren of de backend draait
Open in je browser:

```
http://localhost:8080
```

Of controleer de logs in de terminal op:
```
Started DigitalTwinDashboardApplication
```

### Backend stoppen
Druk in de terminal op:

```
CTRL + C
```

---

💡 **Tip:**  
Als je database connectieproblemen krijgt, controleer:
- of Docker draait
- of de database container actief is
- of `application.properties` de juiste poort (`45432`) gebruikt

## Runnen van frontend

De frontend is een **Vite** applicatie en draait met **Node.js**.

⚠️ Zorg ervoor dat de **backend draait** voordat je de frontend start.

### Vereisten
- Node.js (v18 of hoger)
- npm (meegeleverd met Node.js)

### Frontend starten

Ga naar de root van het project en voer uit:

```bash
npm install
```

Start vervolgens de frontend:

```bash
npm run dev
```

### Frontend URL
De frontend draait standaard op:

```
http://localhost:5173
```

(De exacte poort kan afwijken, zie de terminal output.)

### Controleren of de frontend draait
Open in je browser:

```
http://localhost:5173
```

Als de frontend correct draait, wordt de applicatie geladen en maakt deze verbinding met de backend.

### Frontend stoppen
Druk in de terminal op:

```
CTRL + C
```

### Build voor productie (optioneel)

```bash
npm run build
```

De build output wordt gegenereerd in:

```
dist/
```

### Problemen oplossen

- Controleer of de backend bereikbaar is op `http://localhost:8080`
- Controleer eventuele API-URL configuratie in `vite.config.js`
- Controleer console errors in de browser (F12)






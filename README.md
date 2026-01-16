
# Digital Twin Dashboard

## 📌 Overzicht
Het **Digital Twin Dashboard** biedt een webgebaseerde interface voor het visualiseren en monitoren van digitale tweelingen.  
Deze README beschrijft zowel de **backend (Spring Boot WebFlux)** als de **frontend (Vite/React)**.

Het dashboard is opgezet als een **modulair en schaalbaar platform**, ontworpen om digitale representaties van objecten inzichtelijk te maken en data centraal te tonen, analyseren en interpreteren.

De repository bevat alle onderdelen voor lokale ontwikkeling, verdere uitbreiding en deployment naar productie.  
Een belangrijk onderdeel binnen de repository is de map **`DigitalTwinDashboard`**, die alle broncode en deployment-scripts bevat.

---

## 🚀 Functionaliteit
- Interactieve visualisatie van digitale-twin data.
- Realtime of near-realtime dataverwerking via backend‑services.
- Ondersteuning voor import/export van datasets (o.a. XLSX).
- Duidelijke scheiding tussen frontend (presentatie) en backend (logica/data).
- Uitbreidbaar met extra databronnen, visualisaties en functionaliteiten.
- Ontworpen voor robuust onderhoud, modulariteit en schaalbaarheid.

---

## 🏗️ Architectuur

### **Backend – Spring Boot (WebFlux)**
- Verantwoordelijk voor API‑endpoints, businesslogica en dataverwerking.
- Asynchrone request‑handling via WebFlux.

### **Frontend – Vite + React**
- Moderne Single Page Application.
- Visualisaties via **Chart.js**, componenten via **Lit**.
- Routing via **Vaadin Router**.

### **Database**
- **H2** voor lokale ontwikkeling.
- **PostgreSQL** voor test-, runtime- en productieomgevingen.
  _De database word in een docker container gerunned op de machine_

Frontend en backend communiceren via REST APIs en blijven zelfstandig inzetbaar.

---

## 🛠️ Technologieën
- **Java 17**
- **Spring Boot 3.x (WebFlux)**
- **Maven**
- **Node.js**
- **Vite**
- **Chart.js**
- **Lit**
- **Vaadin Router**

---

## ⚙️ Snel starten

### 1. Vereisten installeren
Installeer:
- Java 17  
- Maven  
- Node.js (LTS aanbevolen)
- Nginx

### 2. Starten van de machine
Nadat het VHD-bestand is geïmporteerd in de Azure-omgeving, zijn er slechts minimale handelingen nodig. In de meeste gevallen start de virtuele machine correct op en is de omgeving direct klaar voor gebruik.

De backend van het Digital Twin Dashboard bevindt zich in de directory `./DigitalTwinDashboard`. Vanuit deze map kan de applicatie worden beheerd en verder worden gestart of aangepast indien nodig.

Raadpleeg altijd eerst de handleiding voor het importeren van het VHD-bestand om te controleren of alle stappen correct zijn uitgevoerd.








package nl.inno.digitaltwindashboard.dashboard.Application;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import nl.inno.digitaltwindashboard.dashboard.Data.SessionRepository;
import nl.inno.digitaltwindashboard.dashboard.Domain.DuplicateSessionException;
import nl.inno.digitaltwindashboard.dashboard.Domain.SessionEntity;
import nl.inno.digitaltwindashboard.dashboard.Presentation.UnityDataDto;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class SessionService {

    private final SessionRepository repository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    // HIER slaan we de Unity resultaten op in het werkgeheugen.
    // Dit raakt de database NIET aan, dus je overschrijft nooit je game-configuratie.
    private final Map<String, UnityDataDto> unityDataStore = new ConcurrentHashMap<>();

    public SessionService(SessionRepository repository) {
        this.repository = repository;
    }

    // --- DATABASE METHODES (Voor Game Configuratie) ---

    public Mono<String> getSession(String sessionCode) {
        return Mono.justOrEmpty(repository.findById(sessionCode))
                .map(SessionEntity::getJsonData);
    }

    public Mono<Void> createSession(String sessionJson) {
        String sessionCode = extractSessionCode(sessionJson);
        if (repository.existsById(sessionCode)) {
            return Mono.error(new DuplicateSessionException());
        }
        repository.save(new SessionEntity(sessionCode, sessionJson));
        return Mono.empty();
    }

    public Mono<Void> updateSession(String sessionJson) {
        String sessionCode = extractSessionCode(sessionJson);
        // Dit overschrijft de configuratie in de DB (bedoeld voor de Admin editor)
        repository.save(new SessionEntity(sessionCode, sessionJson));
        return Mono.empty();
    }

    public Mono<Void> updateParty(int partyId, String sessionJson) {
        return updateSession(sessionJson);
    }

    // --- GEHEUGEN METHODES (Voor Unity Resultaten) ---

    /**
     * Slaat de data van Unity op in een tijdelijke Map in het geheugen.
     * GEEN database interactie hier!
     */
    public Mono<Void> updateUnityData(String sessionCode, UnityDataDto unityData) {
        System.out.println(">> SERVICE: Opslaan in geheugen voor sessie: " + sessionCode);

        // Stop de data in de map
        unityDataStore.put(sessionCode, unityData);

        return Mono.empty();
    }

    /**
     * Haalt de data op uit het geheugen (voor het dashboard).
     */
    public Mono<UnityDataDto> getUnityData(String sessionCode) {
        UnityDataDto data = unityDataStore.get(sessionCode);
        // Geeft de data terug, of leeg als er nog niks is ontvangen
        return Mono.justOrEmpty(data);
    }

    // --- HULP METHODES ---

    private String extractSessionCode(String json) {
        try {
            JsonNode node = objectMapper.readTree(json);
            return node.get("sessionCode").asText();
        } catch (Exception e) {
            throw new RuntimeException("Invalid JSON: sessionCode missing or wrong format");
        }
    }
}
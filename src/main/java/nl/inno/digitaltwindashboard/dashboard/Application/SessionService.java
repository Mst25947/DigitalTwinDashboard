package nl.inno.digitaltwindashboard.dashboard.Application;

import com.fasterxml.jackson.databind.ObjectMapper; // Zorg voor deze import
import nl.inno.digitaltwindashboard.dashboard.Data.SessionRepository;
import nl.inno.digitaltwindashboard.dashboard.Domain.DuplicateSessionException;
import nl.inno.digitaltwindashboard.dashboard.Domain.SessionEntity;
import nl.inno.digitaltwindashboard.dashboard.Presentation.UnityDataDto; // Importeer je DTO
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.util.Optional;

@Service
public class SessionService {
    private final SessionRepository repository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public SessionService(SessionRepository repository) {
        this.repository = repository;
    }

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
        repository.save(new SessionEntity(sessionCode, sessionJson));
        return Mono.empty();
    }

    public Mono<Void> updateParty(int partyId, String sessionJson) {
        return updateSession(sessionJson);
    }

    public Mono<Void> updateUnityData(String sessionCode, UnityDataDto unityData) {
        // 1. Zoek de sessie in de database (JPA is synchroon, dus we krijgen een Optional)
        Optional<SessionEntity> sessionOpt = repository.findById(sessionCode);

        if (sessionOpt.isPresent()) {
            SessionEntity session = sessionOpt.get();
            try {
                // 2. Zet de DTO met getallen om naar een JSON string
                String jsonString = objectMapper.writeValueAsString(unityData);

                // 3. Update de sessie data
                session.setJsonData(jsonString);

                // 4. Sla op in de database
                repository.save(session);

                return Mono.empty();
            } catch (Exception e) {
                return Mono.error(new RuntimeException("Kon Unity data niet opslaan: " + e.getMessage()));
            }
        } else {
            return Mono.error(new RuntimeException("Sessie niet gevonden met code: " + sessionCode));
        }
    }
    // ---------------------------------------

    private String extractSessionCode(String json) {
        try {
            com.fasterxml.jackson.databind.JsonNode node = objectMapper.readTree(json);
            return node.get("sessionCode").asText();
        } catch (Exception e) {
            throw new RuntimeException("Invalid JSON");
        }
    }
}
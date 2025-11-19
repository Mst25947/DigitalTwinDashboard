package nl.inno.digitaltwindashboard.dashboard.Application;

import nl.inno.digitaltwindashboard.dashboard.Data.SessionRepository;
import nl.inno.digitaltwindashboard.dashboard.Domain.DuplicateSessionException;
import nl.inno.digitaltwindashboard.dashboard.Domain.SessionEntity;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
public class SessionService {
    private final SessionRepository repository;

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
        // Voor nu gewoon de hele sessie updaten
        return updateSession(sessionJson);
    }

    private String extractSessionCode(String json) {
        try {
            com.fasterxml.jackson.databind.JsonNode node =
                    new com.fasterxml.jackson.databind.ObjectMapper().readTree(json);
            return node.get("sessionCode").asText();
        } catch (Exception e) {
            throw new RuntimeException("Invalid JSON");
        }
    }
}

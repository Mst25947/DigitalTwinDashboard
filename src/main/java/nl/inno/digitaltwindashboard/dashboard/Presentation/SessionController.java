package nl.inno.digitaltwindashboard.dashboard.Presentation;

import nl.inno.digitaltwindashboard.dashboard.Application.SessionService;
import nl.inno.digitaltwindashboard.dashboard.Domain.DuplicateSessionException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/session")
public class SessionController {

    private final SessionService sessionService;

    public SessionController(SessionService sessionService) {
        this.sessionService = sessionService;
    }

    // Haalt de CONFIGURATIE op (uit DB)
    @GetMapping
    public Mono<ResponseEntity<String>> getSession(@RequestParam String sessionCode) {
        return sessionService.getSession(sessionCode)
                .map(ResponseEntity::ok)
                .switchIfEmpty(Mono.just(ResponseEntity.status(404).body("Session not found")));
    }

    // Haalt de LIVE UNITY DATA op (uit Geheugen) -> NIEUW
    @GetMapping("/{sessionCode}/unity-data")
    public Mono<ResponseEntity<UnityDataDto>> getUnityData(@PathVariable String sessionCode) {
        return sessionService.getUnityData(sessionCode)
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Mono<ResponseEntity<String>> createSession(@RequestBody String sessionJson) {
        return sessionService.createSession(sessionJson)
                .then(Mono.just(ResponseEntity.ok("Created")))
                .onErrorResume(DuplicateSessionException.class,
                        e -> Mono.just(ResponseEntity.status(409).body("Session exists")));
    }

    @PutMapping
    public Mono<ResponseEntity<String>> updateSession(@RequestBody String sessionJson) {
        return sessionService.updateSession(sessionJson)
                .then(Mono.just(ResponseEntity.ok("Updated")));
    }

    @PutMapping("/party/{partyId}")
    public Mono<ResponseEntity<String>> updateParty(@PathVariable int partyId, @RequestBody String sessionJson) {
        return sessionService.updateParty(partyId, sessionJson)
                .then(Mono.just(ResponseEntity.ok("Updated")));
    }

    // Ontvangt data van Unity en stopt het in geheugen
    @PostMapping("/{sessionCode}/unity-data")
    public Mono<ResponseEntity<String>> receiveUnityData(
            @PathVariable String sessionCode,
            @RequestBody UnityDataDto unityData) {

        System.out.println("=== DATA ONTVANGEN VOOR " + sessionCode + " ===");
        System.out.println("Avg1: " + unityData.average1);
        // ... (je logs blijven hetzelfde) ...
        System.out.println("=================================");

        return sessionService.updateUnityData(sessionCode, unityData)
                .then(Mono.just(ResponseEntity.ok("Unity data received and stored in memory")))
                .onErrorResume(e -> {
                    System.err.println("Fout bij verwerken: " + e.getMessage());
                    return Mono.just(ResponseEntity.status(500).body("Error processing data"));
                });
    }
}
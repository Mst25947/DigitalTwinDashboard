package nl.inno.digitaltwindashboard.dashboard.Presentation;


import nl.inno.digitaltwindashboard.dashboard.Application.SessionService;
import nl.inno.digitaltwindashboard.dashboard.Domain.DuplicateSessionException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/session")
public class SessionController {

    private final SessionService sessionService;

    public SessionController(SessionService sessionService) {
        this.sessionService = sessionService;
    }

    @GetMapping
    public Mono<ResponseEntity<String>> getSession(@RequestParam String sessionCode) {
        return sessionService.getSession(sessionCode)
                .map(ResponseEntity::ok)
                .switchIfEmpty(Mono.just(ResponseEntity.status(404).body("Session not found")));
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

    @PostMapping("/{sessionCode}/unity-data")
    public Mono<ResponseEntity<String>> receiveUnityData(
            @PathVariable String sessionCode,
            @RequestBody UnityDataDto unityData) {

        System.out.println("=== DATA ONTVANGEN VOOR " + sessionCode + " ===");
        System.out.println("Avg1: " + unityData.average1);
        System.out.println("Avg2: " + unityData.average2);
        System.out.println("Avg3: " + unityData.average3);
        System.out.println("Avg4: " + unityData.average4);
        System.out.println("Avg5: " + unityData.average5);
        System.out.println("Draagvlak: " + unityData.draagvlakAverage);
        System.out.println("Partij 1: " + unityData.draagvlakPartij1);
        System.out.println("Partij 2: " + unityData.draagvlakPartij2);
        System.out.println("Partij 3: " + unityData.draagvlakPartij3);
        System.out.println("Partij 4: " + unityData.draagvlakPartij4);
        System.out.println("Doel: " + unityData.doelAverage);
        System.out.println("Budget: " + unityData.budgetAverage);
        System.out.println("=================================");


        return sessionService.updateUnityData(sessionCode, unityData)
                .then(Mono.just(ResponseEntity.ok("Unity data processed and saved")))
                .onErrorResume(e -> {
                    System.err.println("Fout bij opslaan: " + e.getMessage());
                    return Mono.just(ResponseEntity.status(500).body("Error saving data"));
                });
    }
}
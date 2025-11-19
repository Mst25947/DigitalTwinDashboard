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
}
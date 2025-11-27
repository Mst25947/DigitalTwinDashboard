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
    public Mono<ResponseEntity<SessionResponseDTO>> getSession(@RequestParam String sessionCode) {
        return sessionService.getSession(sessionCode)
                .map(SessionResponseDTO::new)
                .map(ResponseEntity::ok)
                .switchIfEmpty(Mono.just(ResponseEntity.status(404).body(null)));
    }


    @PostMapping
    public Mono<ResponseEntity<String>> createSession(@RequestBody SessionRequestDTO dto) {
        String json = dto.getJsonData();
        return sessionService.createSession(json)
                .then(Mono.just(ResponseEntity.ok("Created")))
                .onErrorResume(DuplicateSessionExceptionP.class,
                        e -> Mono.just(ResponseEntity.status(409).body("Session exists")));
    }


    @PutMapping
    public Mono<ResponseEntity<String>> updateSession(@RequestBody SessionRequestDTO dto) {
        String json = dto.getJsonData();
        return sessionService.updateSession(json)
                .then(Mono.just(ResponseEntity.ok("Updated")));
    }


    @PutMapping("/party/{partyId}")
    public Mono<ResponseEntity<String>> updateParty(@PathVariable int partyId, @RequestBody SessionRequestDTO dto) {
        String json = dto.getJsonData();
        return sessionService.updateParty(partyId, json)
                .then(Mono.just(ResponseEntity.ok("Updated")));
    }

}
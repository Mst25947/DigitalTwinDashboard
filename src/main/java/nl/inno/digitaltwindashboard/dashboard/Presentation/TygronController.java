package nl.inno.digitaltwindashboard.dashboard.Presentation;

import nl.inno.digitaltwindashboard.dashboard.Application.TygronService;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/tygron")
public class TygronController {
    private final TygronService tygronService;

    public TygronController(TygronService tygronService) {
        this.tygronService = tygronService;
    }

    @GetMapping("/parametric_designs/{id}")
    public Mono<String> getParametricDesign(
            @PathVariable int id,
            @RequestHeader("X-Tygron-Token") String token) {
        return tygronService.getParametricDesign(id, token);
    }

    @GetMapping("/parametric_designs")
    public Mono<String> getParametricDesigns(
            @RequestHeader("X-Tygron-Token") String token) {
        return tygronService.getAllParametricDesigns(token);
    }

}

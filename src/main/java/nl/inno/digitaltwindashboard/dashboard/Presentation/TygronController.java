package nl.inno.digitaltwindashboard.dashboard.Presentation;

import nl.inno.digitaltwindashboard.dashboard.Application.TygronService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/tygron")
public class TygronController {
    private final TygronService tygronService;
    private static final String TOKEN = "297cd11156jms9pG1XxHJAkPmU8Fo9WO";


    public TygronController(TygronService tygronService) {
        this.tygronService = tygronService;
    }

    @GetMapping("/parametric_designs/{id}")
    public Mono<String> getParametricDesign(@PathVariable int id) {
        return tygronService.getParametricDesign(id, TOKEN);
    }

    @GetMapping("/parametric_designs")
    public Mono<String> getParametricDesigns() {
        return tygronService.getAllParametricDesigns(TOKEN);
    }

}

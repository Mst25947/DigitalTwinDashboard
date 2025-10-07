package nl.inno.digitaltwindashboard.dashboard.Application;

import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Service
public class TygronService {
    private WebClient webclient;

    public TygronService(WebClient.Builder clientBuilder) {
        this.webclient = clientBuilder.baseUrl("https://engine.tygron.com").build();
    }

    public Mono<String> getParametricDesign(int designId, String token) {
        return webclient.get()
                .uri("/api/session/items/parametric_designs/{id}/?f=JSON&token={token}", designId, token)
                .retrieve()
                .bodyToMono(String.class);
    }
}

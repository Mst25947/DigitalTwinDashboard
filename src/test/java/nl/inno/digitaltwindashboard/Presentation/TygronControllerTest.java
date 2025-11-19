package nl.inno.digitaltwindashboard.Presentation;

import nl.inno.digitaltwindashboard.dashboard.Application.TygronService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.reactive.AutoConfigureWebTestClient;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.reactive.server.WebTestClient;
import reactor.core.publisher.Mono;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureWebTestClient
class TygronControllerTest {

    @Autowired
    private WebTestClient webTestClient;

    @MockBean
    private TygronService tygronService;

    private static final String token = "test-token";

    @Test
    void getParametricDesignReturnDesign() {
        int id = 42;
        String expectedResponse = "{ \"design\": \"example\" }";

        Mockito.when(tygronService.getParametricDesign(id, token))
                .thenReturn(Mono.just(expectedResponse));

        webTestClient.get()
                .uri("/api/tygron/parametric_designs/{id}", id)
                .header("X-Tygron-Token", token)
                .exchange()
                .expectStatus().isOk()
                .expectBody(String.class)
                .isEqualTo(expectedResponse);
    }

    @Test
    void getAllParametricDesignsReturnAllDesigns() {
        String expectedResponse = "[{\"design\": \"one\"}, {\"design\": \"two\"}]";

        Mockito.when(tygronService.getAllParametricDesigns(token))
                .thenReturn(Mono.just(expectedResponse));

        webTestClient.get()
                .uri("/api/tygron/parametric_designs")
                .header("X-Tygron-Token", token)
                .exchange()
                .expectStatus().isOk()
                .expectBody(String.class)
                .isEqualTo(expectedResponse);
    }
}
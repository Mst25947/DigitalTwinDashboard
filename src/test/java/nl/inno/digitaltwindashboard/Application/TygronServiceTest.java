package nl.inno.digitaltwindashboard.Application;

import nl.inno.digitaltwindashboard.dashboard.Application.TygronService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClient.RequestHeadersUriSpec;
import org.springframework.web.reactive.function.client.WebClient.RequestHeadersSpec;
import org.springframework.web.reactive.function.client.WebClient.ResponseSpec;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TygronServiceTest {

    private TygronService tygronService;

    @Mock
    private WebClient.Builder webClientBuilder;

    @Mock
    private WebClient webClient;
    @Mock
    private RequestHeadersUriSpec requestHeadersUriSpec;
    @Mock
    private RequestHeadersSpec requestHeadersSpec;
    @Mock
    private ResponseSpec responseSpec;

    private static final String mockToken = "testToken123";
    private static final String mockResponse = "{\"data\":\"mocked response\"}";
    private static final int mockDesignId = 42;

    @BeforeEach
    void setUp() {
        when(webClientBuilder.baseUrl(anyString())).thenReturn(webClientBuilder);

        when(webClientBuilder.build()).thenReturn(webClient);

        this.tygronService = new TygronService(webClientBuilder);

        when(webClient.get()).thenReturn(requestHeadersUriSpec);
    }

    @Test
    void getParametricDesignCorrectUrlAndReturnMonoString() {
        when(requestHeadersUriSpec.uri(anyString(), eq(mockDesignId), eq(mockToken)))
                .thenReturn(requestHeadersSpec);

        when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);

        when(responseSpec.bodyToMono(String.class)).thenReturn(Mono.just(mockResponse));

        Mono<String> resultMono = tygronService.getParametricDesign(mockDesignId, mockToken);

        StepVerifier.create(resultMono)
                .expectNext(mockResponse)
                .verifyComplete();

        verify(webClient, times(1)).get();
        verify(requestHeadersUriSpec, times(1)).uri(anyString(), eq(mockDesignId), eq(mockToken));
        verify(requestHeadersSpec, times(1)).retrieve();
    }

    @Test
    void getAllParametricDesignsCorrectUrlAndReturnMonoString() {

        when(requestHeadersUriSpec.uri(anyString(), eq(mockToken))).thenReturn(requestHeadersSpec);

        when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);

        when(responseSpec.bodyToMono(String.class)).thenReturn(Mono.just(mockResponse));

        Mono<String> resultMono = tygronService.getAllParametricDesigns(mockToken);

        StepVerifier.create(resultMono)
                .expectNext(mockResponse)
                .verifyComplete();

        verify(webClient, times(1)).get();
        verify(requestHeadersUriSpec, times(1)).uri(anyString(), eq(mockToken));
        verify(requestHeadersSpec, times(1)).retrieve();
    }
}

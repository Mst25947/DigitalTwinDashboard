package nl.inno.digitaltwindashboard;

import com.tngtech.archunit.core.domain.JavaClasses;
import com.tngtech.archunit.core.importer.ClassFileImporter;
import com.tngtech.archunit.lang.ArchRule;
import org.junit.jupiter.api.Test;

import static com.tngtech.archunit.library.Architectures.layeredArchitecture;

public class ArchitectureTest {

    private final JavaClasses importedClasses = new ClassFileImporter()
            .importPackages("nl.inno.digitaltwindashboard.dashboard");

    @Test
    void lagenMogenAlleenVanBovenNaarBeneden() {
        ArchRule rule = layeredArchitecture()
                .consideringOnlyDependenciesInLayers()
                .layer("Presentation").definedBy("..Presentation..")
                .layer("Application").definedBy("..Application..")
                .layer("Domain").definedBy("..Domain..")
                .layer("Data").definedBy("..Data..")

                .whereLayer("Presentation").mayOnlyAccessLayers("Application")

                .whereLayer("Application").mayOnlyAccessLayers("Domain", "Data")

                .whereLayer("Domain").mayOnlyAccessLayers("Domain")

                .whereLayer("Data").mayOnlyAccessLayers("Domain");

        rule.check(importedClasses);
    }

}
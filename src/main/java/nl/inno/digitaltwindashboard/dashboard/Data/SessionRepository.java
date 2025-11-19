package nl.inno.digitaltwindashboard.dashboard.Data;

import nl.inno.digitaltwindashboard.dashboard.Domain.SessionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SessionRepository extends JpaRepository<SessionEntity, String> {
}

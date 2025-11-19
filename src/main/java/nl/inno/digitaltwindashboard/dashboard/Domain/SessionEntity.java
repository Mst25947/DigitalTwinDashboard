package nl.inno.digitaltwindashboard.dashboard.Domain;

import jakarta.persistence.*;
import java.util.List;

@Entity
public class SessionEntity {

    @Id
    private String sessionCode;

    @Column(length = 10000)
    private String jsonData;

    public SessionEntity() {}

    public SessionEntity(String sessionCode, String jsonData) {
        this.sessionCode = sessionCode;
        this.jsonData = jsonData;
    }

    public String getSessionCode() {
        return sessionCode;
    }

    public void setSessionCode(String sessionCode) {
        this.sessionCode = sessionCode;
    }

    public String getJsonData() {
        return jsonData;
    }

    public void setJsonData(String jsonData) {
        this.jsonData = jsonData;
    }
}
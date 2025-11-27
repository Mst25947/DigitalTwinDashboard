package nl.inno.digitaltwindashboard.dashboard.Presentation;

public class SessionRequestDTO {
    private String sessionJson;

    private String sessionCode;

    private String jsonData;

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

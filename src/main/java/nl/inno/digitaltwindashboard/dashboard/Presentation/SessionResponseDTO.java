package nl.inno.digitaltwindashboard.dashboard.Presentation;

public class SessionResponseDTO {
    private String jsonData;

    public SessionResponseDTO(String jsonData) {
        this.jsonData = jsonData;
    }

    public String getJsonData() {
        return jsonData;
    }

    public void setJsonData(String jsonData) {
        this.jsonData = jsonData;
    }
}

package nl.inno.digitaltwindashboard.dashboard.Domain;

public class DuplicateSessionException extends RuntimeException {
    public DuplicateSessionException() {
        super("Session with this code already exists");
    }
}
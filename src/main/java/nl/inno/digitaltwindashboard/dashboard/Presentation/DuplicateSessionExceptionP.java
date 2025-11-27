package nl.inno.digitaltwindashboard.dashboard.Presentation;

public class DuplicateSessionExceptionP extends RuntimeException {
    public DuplicateSessionExceptionP() {
        super("Session with this code already exists");
    }
}
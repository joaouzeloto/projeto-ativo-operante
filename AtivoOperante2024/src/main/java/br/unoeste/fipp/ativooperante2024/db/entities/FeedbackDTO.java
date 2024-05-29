package br.unoeste.fipp.ativooperante2024.db.entities;

public class FeedbackDTO {
    private String texto;
    private Long denuncia;

    // Getters e Setters
    public String getTexto() {
        return texto;
    }

    public void setTexto(String texto) {
        this.texto = texto;
    }

    public Long getDenuncia() {
        return denuncia;
    }

    public void setDenuncia(Long denuncia) {
        this.denuncia = denuncia;
    }
}

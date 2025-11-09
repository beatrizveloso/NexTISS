package com.nextis.models;

import org.bson.types.ObjectId;
import java.util.Date;

/**
 * Modelo de dados para Configurações do Sistema
 */
public class SystemSettings {

    private ObjectId id;
    private ObjectId establishmentId;
    private boolean emailNotifications;
    private int minStockAlert;
    private String timezone;
    private String currency;
    private String language;
    private Date createdAt;
    private Date updatedAt;

    public SystemSettings() {
        this.createdAt = new Date();
        this.updatedAt = new Date();
        this.emailNotifications = true;
        this.minStockAlert = 5;
        this.timezone = "America/Sao_Paulo";
        this.currency = "BRL";
        this.language = "pt-BR";
    }

    // Getters e Setters
    public ObjectId getId() { return id; }
    public void setId(ObjectId id) { this.id = id; }

    public ObjectId getEstablishmentId() { return establishmentId; }
    public void setEstablishmentId(ObjectId establishmentId) {
        this.establishmentId = establishmentId;
        this.updatedAt = new Date();
    }

    public boolean isEmailNotifications() { return emailNotifications; }
    public void setEmailNotifications(boolean emailNotifications) {
        this.emailNotifications = emailNotifications;
        this.updatedAt = new Date();
    }

    public int getMinStockAlert() { return minStockAlert; }
    public void setMinStockAlert(int minStockAlert) {
        this.minStockAlert = minStockAlert;
        this.updatedAt = new Date();
    }

    public String getTimezone() { return timezone; }
    public void setTimezone(String timezone) {
        this.timezone = timezone;
        this.updatedAt = new Date();
    }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) {
        this.currency = currency;
        this.updatedAt = new Date();
    }

    public String getLanguage() { return language; }
    public void setLanguage(String language) {
        this.language = language;
        this.updatedAt = new Date();
    }

    public Date getCreatedAt() { return createdAt; }
    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }

    public Date getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Date updatedAt) { this.updatedAt = updatedAt; }

    @Override
    public String toString() {
        return "SystemSettings{" +
                "id=" + id +
                ", emailNotifications=" + emailNotifications +
                ", minStockAlert=" + minStockAlert +
                ", timezone='" + timezone + '\'' +
                '}';
    }
}
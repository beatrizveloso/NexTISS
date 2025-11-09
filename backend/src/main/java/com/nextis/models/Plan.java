package com.nextis.models;

import org.bson.types.ObjectId;
import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * Modelo de dados para Plano de Assinatura
 */
public class Plan {

    private ObjectId id;
    private String name;
    private String type;
    private String productRange;
    private Map<String, Double> pricing;
    private Map<String, Integer> discounts;
    private List<String> features;
    private String description;
    private boolean isActive;
    private Date createdAt;
    private Date updatedAt;

    public Plan() {
        this.createdAt = new Date();
        this.updatedAt = new Date();
        this.isActive = true;
    }

    // Getters e Setters
    public ObjectId getId() { return id; }
    public void setId(ObjectId id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) {
        this.name = name;
        this.updatedAt = new Date();
    }

    public String getType() { return type; }
    public void setType(String type) {
        this.type = type;
        this.updatedAt = new Date();
    }

    public String getProductRange() { return productRange; }
    public void setProductRange(String productRange) {
        this.productRange = productRange;
        this.updatedAt = new Date();
    }

    public Map<String, Double> getPricing() { return pricing; }
    public void setPricing(Map<String, Double> pricing) {
        this.pricing = pricing;
        this.updatedAt = new Date();
    }

    public Map<String, Integer> getDiscounts() { return discounts; }
    public void setDiscounts(Map<String, Integer> discounts) {
        this.discounts = discounts;
        this.updatedAt = new Date();
    }

    public List<String> getFeatures() { return features; }
    public void setFeatures(List<String> features) {
        this.features = features;
        this.updatedAt = new Date();
    }

    public String getDescription() { return description; }
    public void setDescription(String description) {
        this.description = description;
        this.updatedAt = new Date();
    }

    public boolean isActive() { return isActive; }
    public void setActive(boolean active) {
        isActive = active;
        this.updatedAt = new Date();
    }

    public Date getCreatedAt() { return createdAt; }
    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }

    public Date getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Date updatedAt) { this.updatedAt = updatedAt; }

    @Override
    public String toString() {
        return "Plan{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", type='" + type + '\'' +
                ", productRange='" + productRange + '\'' +
                ", isActive=" + isActive +
                '}';
    }
}
package com.nextis.models;

import org.bson.types.ObjectId;
import java.util.Date;

/**
 * Modelo de dados para Itens do Cardápio (ComandOU)
 */
public class MenuItem {

    private ObjectId id;
    private ObjectId establishmentId;
    private String name;
    private String description;
    private String category;
    private int availableQuantity;
    private String unit;
    private int unitSize;
    private PriceOptions priceOptions;
    private ServingInfo servingInfo;
    private int lowStockThreshold;
    private boolean isLowStock;
    private boolean isAvailable;
    private String imageUrl;
    private Date createdAt;
    private Date updatedAt;

    public static class PriceOptions {
        private Double simplePrice;
        private DosePrice dosePrice;
        private Double bottlePrice;

        public PriceOptions() {}

        public PriceOptions(Double simplePrice) {
            this.simplePrice = simplePrice;
        }

        public PriceOptions(DosePrice dosePrice, Double bottlePrice) {
            this.dosePrice = dosePrice;
            this.bottlePrice = bottlePrice;
        }

        public Double getSimplePrice() { return simplePrice; }
        public void setSimplePrice(Double simplePrice) { this.simplePrice = simplePrice; }

        public DosePrice getDosePrice() { return dosePrice; }
        public void setDosePrice(DosePrice dosePrice) { this.dosePrice = dosePrice; }

        public Double getBottlePrice() { return bottlePrice; }
        public void setBottlePrice(Double bottlePrice) { this.bottlePrice = bottlePrice; }
    }

    public static class DosePrice {
        private Double price;
        private String description;
        private int volumeMl;

        public DosePrice() {}

        public DosePrice(Double price, String description, int volumeMl) {
            this.price = price;
            this.description = description;
            this.volumeMl = volumeMl;
        }

        public Double getPrice() { return price; }
        public void setPrice(Double price) { this.price = price; }

        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }

        public int getVolumeMl() { return volumeMl; }
        public void setVolumeMl(int volumeMl) { this.volumeMl = volumeMl; }
    }

    public static class ServingInfo {
        private String glassType;
        private int servingSize;

        public ServingInfo() {}

        public ServingInfo(String glassType, int servingSize) {
            this.glassType = glassType;
            this.servingSize = servingSize;
        }

        public String getGlassType() { return glassType; }
        public void setGlassType(String glassType) { this.glassType = glassType; }

        public int getServingSize() { return servingSize; }
        public void setServingSize(int servingSize) { this.servingSize = servingSize; }
    }

    public MenuItem() {
        this.createdAt = new Date();
        this.updatedAt = new Date();
        this.isAvailable = true;
        this.lowStockThreshold = 5;
        this.isLowStock = false;
    }

    // Getters e Setters
    public ObjectId getId() { return id; }
    public void setId(ObjectId id) { this.id = id; }

    public ObjectId getEstablishmentId() { return establishmentId; }
    public void setEstablishmentId(ObjectId establishmentId) {
        this.establishmentId = establishmentId;
        this.updatedAt = new Date();
    }

    public String getName() { return name; }
    public void setName(String name) {
        this.name = name;
        this.updatedAt = new Date();
    }

    public String getDescription() { return description; }
    public void setDescription(String description) {
        this.description = description;
        this.updatedAt = new Date();
    }

    public String getCategory() { return category; }
    public void setCategory(String category) {
        this.category = category;
        this.updatedAt = new Date();
    }

    public int getAvailableQuantity() { return availableQuantity; }
    public void setAvailableQuantity(int availableQuantity) {
        this.availableQuantity = availableQuantity;
        this.isLowStock = availableQuantity <= lowStockThreshold;
        this.updatedAt = new Date();
    }

    public String getUnit() { return unit; }
    public void setUnit(String unit) {
        this.unit = unit;
        this.updatedAt = new Date();
    }

    public int getUnitSize() { return unitSize; }
    public void setUnitSize(int unitSize) {
        this.unitSize = unitSize;
        this.updatedAt = new Date();
    }

    public PriceOptions getPriceOptions() { return priceOptions; }
    public void setPriceOptions(PriceOptions priceOptions) {
        this.priceOptions = priceOptions;
        this.updatedAt = new Date();
    }

    public ServingInfo getServingInfo() { return servingInfo; }
    public void setServingInfo(ServingInfo servingInfo) {
        this.servingInfo = servingInfo;
        this.updatedAt = new Date();
    }

    public int getLowStockThreshold() { return lowStockThreshold; }
    public void setLowStockThreshold(int lowStockThreshold) {
        this.lowStockThreshold = lowStockThreshold;
        this.isLowStock = availableQuantity <= lowStockThreshold;
        this.updatedAt = new Date();
    }

    public boolean isLowStock() { return isLowStock; }
    public void setLowStock(boolean lowStock) {
        isLowStock = lowStock;
        this.updatedAt = new Date();
    }

    public boolean isAvailable() { return isAvailable; }
    public void setAvailable(boolean available) {
        isAvailable = available;
        this.updatedAt = new Date();
    }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
        this.updatedAt = new Date();
    }

    public Date getCreatedAt() { return createdAt; }
    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }

    public Date getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Date updatedAt) { this.updatedAt = updatedAt; }

    @Override
    public String toString() {
        return "MenuItem{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", category='" + category + '\'' +
                ", availableQuantity=" + availableQuantity +
                ", isLowStock=" + isLowStock +
                ", isAvailable=" + isAvailable +
                '}';
    }
}
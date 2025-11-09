package com.nextis.models;

import org.bson.types.ObjectId;
import java.util.Date;

/**
 * Modelo de dados para Produtos (eStock)
 */
public class Product {

    private ObjectId id;
    private ObjectId establishmentId;
    private String name;
    private int quantity;
    private int capacityMl;
    private int shotSizeMl;
    private int shotsPerUnit;
    private int totalShots;
    private Date expirationDate;
    private String supplier;
    private ObjectId supplierId;
    private String imageUrl;
    private String category;
    private String sku;
    private int minStockLevel;
    private int maxStockLevel;
    private boolean lowStockAlert;
    private double costPrice;
    private double salePrice;
    private Date createdAt;
    private Date updatedAt;

    public Product() {
        this.createdAt = new Date();
        this.updatedAt = new Date();
        this.minStockLevel = 5;
        this.maxStockLevel = 30;
        this.lowStockAlert = false;
    }

    public void calculateShots() {
        if (capacityMl > 0 && shotSizeMl > 0) {
            this.shotsPerUnit = capacityMl / shotSizeMl;
            this.totalShots = shotsPerUnit * quantity;
        } else {
            this.shotsPerUnit = 1;
            this.totalShots = quantity;
        }
        checkLowStock();
    }

    public void checkLowStock() {
        this.lowStockAlert = this.quantity <= this.minStockLevel;
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

    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) {
        this.quantity = quantity;
        calculateShots();
        this.updatedAt = new Date();
    }

    public int getCapacityMl() { return capacityMl; }
    public void setCapacityMl(int capacityMl) {
        this.capacityMl = capacityMl;
        calculateShots();
        this.updatedAt = new Date();
    }

    public int getShotSizeMl() { return shotSizeMl; }
    public void setShotSizeMl(int shotSizeMl) {
        this.shotSizeMl = shotSizeMl;
        calculateShots();
        this.updatedAt = new Date();
    }

    public int getShotsPerUnit() { return shotsPerUnit; }
    public void setShotsPerUnit(int shotsPerUnit) { this.shotsPerUnit = shotsPerUnit; }

    public int getTotalShots() { return totalShots; }
    public void setTotalShots(int totalShots) { this.totalShots = totalShots; }

    public Date getExpirationDate() { return expirationDate; }
    public void setExpirationDate(Date expirationDate) {
        this.expirationDate = expirationDate;
        this.updatedAt = new Date();
    }

    public String getSupplier() { return supplier; }
    public void setSupplier(String supplier) {
        this.supplier = supplier;
        this.updatedAt = new Date();
    }

    public ObjectId getSupplierId() { return supplierId; }
    public void setSupplierId(ObjectId supplierId) {
        this.supplierId = supplierId;
        this.updatedAt = new Date();
    }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
        this.updatedAt = new Date();
    }

    public String getCategory() { return category; }
    public void setCategory(String category) {
        this.category = category;
        this.updatedAt = new Date();
    }

    public String getSku() { return sku; }
    public void setSku(String sku) {
        this.sku = sku;
        this.updatedAt = new Date();
    }

    public int getMinStockLevel() { return minStockLevel; }
    public void setMinStockLevel(int minStockLevel) {
        this.minStockLevel = minStockLevel;
        checkLowStock();
        this.updatedAt = new Date();
    }

    public int getMaxStockLevel() { return maxStockLevel; }
    public void setMaxStockLevel(int maxStockLevel) {
        this.maxStockLevel = maxStockLevel;
        this.updatedAt = new Date();
    }

    public boolean isLowStockAlert() { return lowStockAlert; }
    public void setLowStockAlert(boolean lowStockAlert) {
        this.lowStockAlert = lowStockAlert;
        this.updatedAt = new Date();
    }

    public double getCostPrice() { return costPrice; }
    public void setCostPrice(double costPrice) {
        this.costPrice = costPrice;
        this.updatedAt = new Date();
    }

    public double getSalePrice() { return salePrice; }
    public void setSalePrice(double salePrice) {
        this.salePrice = salePrice;
        this.updatedAt = new Date();
    }

    public Date getCreatedAt() { return createdAt; }
    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }

    public Date getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Date updatedAt) { this.updatedAt = updatedAt; }

    @Override
    public String toString() {
        return "Product{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", quantity=" + quantity +
                ", totalShots=" + totalShots +
                ", supplier='" + supplier + '\'' +
                ", lowStockAlert=" + lowStockAlert +
                '}';
    }
}
package com.nextis.models;

import org.bson.types.ObjectId;
import java.util.Date;
import java.util.List;

/**
 * Modelo de dados para Vendas
 */
public class Sale {

    private ObjectId id;
    private ObjectId establishmentId;
    private List<SaleItem> items;
    private double total;
    private String paymentMethod;
    private Date saleDate;
    private ObjectId userId;
    private String userName;

    public static class SaleItem {
        private ObjectId productId;
        private String productName;
        private int quantity;
        private double unitPrice;
        private double subtotal;

        public SaleItem() {}

        public SaleItem(ObjectId productId, String productName, int quantity, double unitPrice) {
            this.productId = productId;
            this.productName = productName;
            this.quantity = quantity;
            this.unitPrice = unitPrice;
            this.subtotal = quantity * unitPrice;
        }

        public ObjectId getProductId() { return productId; }
        public void setProductId(ObjectId productId) { this.productId = productId; }

        public String getProductName() { return productName; }
        public void setProductName(String productName) { this.productName = productName; }

        public int getQuantity() { return quantity; }
        public void setQuantity(int quantity) {
            this.quantity = quantity;
            this.subtotal = quantity * unitPrice;
        }

        public double getUnitPrice() { return unitPrice; }
        public void setUnitPrice(double unitPrice) {
            this.unitPrice = unitPrice;
            this.subtotal = quantity * unitPrice;
        }

        public double getSubtotal() { return subtotal; }
        public void setSubtotal(double subtotal) { this.subtotal = subtotal; }
    }

    public Sale() {
        this.saleDate = new Date();
    }

    // Getters e Setters
    public ObjectId getId() { return id; }
    public void setId(ObjectId id) { this.id = id; }

    public ObjectId getEstablishmentId() { return establishmentId; }
    public void setEstablishmentId(ObjectId establishmentId) {
        this.establishmentId = establishmentId;
    }

    public List<SaleItem> getItems() { return items; }
    public void setItems(List<SaleItem> items) { this.items = items; }

    public double getTotal() { return total; }
    public void setTotal(double total) { this.total = total; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public Date getSaleDate() { return saleDate; }
    public void setSaleDate(Date saleDate) { this.saleDate = saleDate; }

    public ObjectId getUserId() { return userId; }
    public void setUserId(ObjectId userId) { this.userId = userId; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    @Override
    public String toString() {
        return "Sale{" +
                "id=" + id +
                ", total=" + total +
                ", saleDate=" + saleDate +
                ", userName='" + userName + '\'' +
                '}';
    }
}
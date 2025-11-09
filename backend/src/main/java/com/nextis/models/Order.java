package com.nextis.models;

import org.bson.types.ObjectId;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * Modelo de dados para Pedidos (ComandOU)
 */
public class Order {

    private ObjectId id;
    private ObjectId establishmentId;
    private String tableNumber;
    private String customerName;
    private List<OrderItem> items;
    private double subtotal;
    private double serviceCharge;
    private double total;
    private OrderStatus status;
    private PaymentStatus paymentStatus;
    private String paymentMethod;
    private String notes;
    private Date createdAt;
    private Date updatedAt;
    private Date preparedAt;
    private Date deliveredAt;
    private Date completedAt;

    public enum OrderStatus {
        PENDING("Aguardando Confirmação"),
        CONFIRMED("Confirmado"),
        PREPARING("Em Preparo"),
        READY("Pronto"),
        DELIVERED("Entregue"),
        CANCELLED("Cancelado");

        private final String description;

        OrderStatus(String description) {
            this.description = description;
        }

        public String getDescription() {
            return description;
        }
    }

    public enum PaymentStatus {
        PENDING("Pendente"),
        PAID("Pago"),
        CANCELLED("Cancelado");

        private final String description;

        PaymentStatus(String description) {
            this.description = description;
        }

        public String getDescription() {
            return description;
        }
    }

    public static class OrderItem {
        private ObjectId menuItemId;
        private String name;
        private String orderType;
        private int quantity;
        private double unitPrice;
        private double subtotal;
        private String notes;

        public OrderItem() {}

        public OrderItem(ObjectId menuItemId, String name, String orderType,
                         int quantity, double unitPrice, String notes) {
            this.menuItemId = menuItemId;
            this.name = name;
            this.orderType = orderType;
            this.quantity = quantity;
            this.unitPrice = unitPrice;
            this.subtotal = quantity * unitPrice;
            this.notes = notes;
        }

        public ObjectId getMenuItemId() { return menuItemId; }
        public void setMenuItemId(ObjectId menuItemId) { this.menuItemId = menuItemId; }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String getOrderType() { return orderType; }
        public void setOrderType(String orderType) { this.orderType = orderType; }

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

        public String getNotes() { return notes; }
        public void setNotes(String notes) { this.notes = notes; }
    }

    public Order() {
        this.items = new ArrayList<>();
        this.createdAt = new Date();
        this.updatedAt = new Date();
        this.status = OrderStatus.PENDING;
        this.paymentStatus = PaymentStatus.PENDING;
        this.subtotal = 0.0;
        this.serviceCharge = 0.0;
        this.total = 0.0;
    }

    public void calculateTotals(boolean includeServiceCharge) {
        this.subtotal = items.stream()
                .mapToDouble(OrderItem::getSubtotal)
                .sum();

        if (includeServiceCharge) {
            this.serviceCharge = this.subtotal * 0.10;
        } else {
            this.serviceCharge = 0.0;
        }

        this.total = this.subtotal + this.serviceCharge;
        this.updatedAt = new Date();
    }

    public void addItem(OrderItem item) {
        this.items.add(item);
        calculateTotals(true);
    }

    public void removeItem(int index) {
        if (index >= 0 && index < items.size()) {
            this.items.remove(index);
            calculateTotals(true);
        }
    }

    // Getters e Setters
    public ObjectId getId() { return id; }
    public void setId(ObjectId id) { this.id = id; }

    public ObjectId getEstablishmentId() { return establishmentId; }
    public void setEstablishmentId(ObjectId establishmentId) {
        this.establishmentId = establishmentId;
        this.updatedAt = new Date();
    }

    public String getTableNumber() { return tableNumber; }
    public void setTableNumber(String tableNumber) {
        this.tableNumber = tableNumber;
        this.updatedAt = new Date();
    }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) {
        this.customerName = customerName;
        this.updatedAt = new Date();
    }

    public List<OrderItem> getItems() { return items; }
    public void setItems(List<OrderItem> items) {
        this.items = items;
        calculateTotals(true);
    }

    public double getSubtotal() { return subtotal; }
    public void setSubtotal(double subtotal) { this.subtotal = subtotal; }

    public double getServiceCharge() { return serviceCharge; }
    public void setServiceCharge(double serviceCharge) { this.serviceCharge = serviceCharge; }

    public double getTotal() { return total; }
    public void setTotal(double total) { this.total = total; }

    public OrderStatus getStatus() { return status; }
    public void setStatus(OrderStatus status) {
        this.status = status;
        this.updatedAt = new Date();

        if (status == OrderStatus.READY && this.preparedAt == null) {
            this.preparedAt = new Date();
        } else if (status == OrderStatus.DELIVERED && this.deliveredAt == null) {
            this.deliveredAt = new Date();
        }
    }

    public PaymentStatus getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(PaymentStatus paymentStatus) {
        this.paymentStatus = paymentStatus;
        this.updatedAt = new Date();

        if (paymentStatus == PaymentStatus.PAID && this.completedAt == null) {
            this.completedAt = new Date();
        }
    }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
        this.updatedAt = new Date();
    }

    public String getNotes() { return notes; }
    public void setNotes(String notes) {
        this.notes = notes;
        this.updatedAt = new Date();
    }

    public Date getCreatedAt() { return createdAt; }
    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }

    public Date getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Date updatedAt) { this.updatedAt = updatedAt; }

    public Date getPreparedAt() { return preparedAt; }
    public void setPreparedAt(Date preparedAt) { this.preparedAt = preparedAt; }

    public Date getDeliveredAt() { return deliveredAt; }
    public void setDeliveredAt(Date deliveredAt) { this.deliveredAt = deliveredAt; }

    public Date getCompletedAt() { return completedAt; }
    public void setCompletedAt(Date completedAt) { this.completedAt = completedAt; }

    @Override
    public String toString() {
        return "Order{" +
                "id=" + id +
                ", tableNumber='" + tableNumber + '\'' +
                ", total=" + total +
                ", status=" + status +
                ", paymentStatus=" + paymentStatus +
                ", items=" + items.size() +
                '}';
    }
}
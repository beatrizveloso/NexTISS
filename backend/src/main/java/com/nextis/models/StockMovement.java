package com.nextis.models;

import org.bson.types.ObjectId;
import java.util.Date;

/**
 * Modelo de dados para Movimentações de Estoque
 */
public class StockMovement {

    private ObjectId id;
    private ObjectId establishmentId;
    private ObjectId productId;
    private String productName;
    private MovementType type;
    private int quantity;
    private String reason;
    private ObjectId userId;
    private String userName;
    private Date movementDate;
    private Date createdAt;

    public enum MovementType {
        ENTRADA("Entrada"),
        SAIDA("Saída"),
        AJUSTE("Ajuste"),
        PERDA("Perda"),
        DEVOLUCAO("Devolução");

        private final String description;

        MovementType(String description) {
            this.description = description;
        }

        public String getDescription() {
            return description;
        }
    }

    public StockMovement() {
        this.createdAt = new Date();
        this.movementDate = new Date();
    }

    // Getters e Setters
    public ObjectId getId() { return id; }
    public void setId(ObjectId id) { this.id = id; }

    public ObjectId getEstablishmentId() { return establishmentId; }
    public void setEstablishmentId(ObjectId establishmentId) {
        this.establishmentId = establishmentId;
    }

    public ObjectId getProductId() { return productId; }
    public void setProductId(ObjectId productId) { this.productId = productId; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public MovementType getType() { return type; }
    public void setType(MovementType type) { this.type = type; }

    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public ObjectId getUserId() { return userId; }
    public void setUserId(ObjectId userId) { this.userId = userId; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public Date getMovementDate() { return movementDate; }
    public void setMovementDate(Date movementDate) { this.movementDate = movementDate; }

    public Date getCreatedAt() { return createdAt; }
    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }

    @Override
    public String toString() {
        return "StockMovement{" +
                "id=" + id +
                ", productName='" + productName + '\'' +
                ", type=" + type +
                ", quantity=" + quantity +
                ", movementDate=" + movementDate +
                '}';
    }
}
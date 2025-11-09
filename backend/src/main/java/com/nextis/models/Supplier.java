package com.nextis.models;

import org.bson.types.ObjectId;
import java.util.Date;

/**
 * Modelo de dados para Fornecedores
 */
public class Supplier {

    private ObjectId id;
    private ObjectId establishmentId;
    private String name;
    private String contactPerson;
    private String email;
    private String phone;
    private String address;
    private String cnpj;
    private boolean isActive;
    private Date createdAt;
    private Date updatedAt;

    public Supplier() {
        this.createdAt = new Date();
        this.updatedAt = new Date();
        this.isActive = true;
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

    public String getContactPerson() { return contactPerson; }
    public void setContactPerson(String contactPerson) {
        this.contactPerson = contactPerson;
        this.updatedAt = new Date();
    }

    public String getEmail() { return email; }
    public void setEmail(String email) {
        this.email = email;
        this.updatedAt = new Date();
    }

    public String getPhone() { return phone; }
    public void setPhone(String phone) {
        this.phone = phone;
        this.updatedAt = new Date();
    }

    public String getAddress() { return address; }
    public void setAddress(String address) {
        this.address = address;
        this.updatedAt = new Date();
    }

    public String getCnpj() { return cnpj; }
    public void setCnpj(String cnpj) {
        this.cnpj = cnpj;
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
        return "Supplier{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", contactPerson='" + contactPerson + '\'' +
                ", email='" + email + '\'' +
                ", phone='" + phone + '\'' +
                '}';
    }
}
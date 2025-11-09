package com.nextis.models;

import org.bson.types.ObjectId;
import java.util.Date;

/**
 * Modelo de dados para Usuário
 */
public class User {

    private ObjectId id;
    private String name;
    private String email;
    private String password;
    private String phone;
    private String cpf;
    private ObjectId establishmentId;
    private String role;
    private String authProvider;
    private Date createdAt;
    private Date updatedAt;
    private boolean isActive;
    private String rememberToken;

    public User() {
        this.createdAt = new Date();
        this.updatedAt = new Date();
        this.isActive = true;
        this.authProvider = "email";
    }

    public User(String name, String email, String password) {
        this();
        this.name = name;
        this.email = email;
        this.password = password;
    }

    // Getters e Setters
    public ObjectId getId() { return id; }
    public void setId(ObjectId id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) {
        this.name = name;
        this.updatedAt = new Date();
    }

    public String getEmail() { return email; }
    public void setEmail(String email) {
        this.email = email;
        this.updatedAt = new Date();
    }

    public String getPassword() { return password; }
    public void setPassword(String password) {
        this.password = password;
        this.updatedAt = new Date();
    }

    public String getPhone() { return phone; }
    public void setPhone(String phone) {
        this.phone = phone;
        this.updatedAt = new Date();
    }

    public String getCpf() { return cpf; }
    public void setCpf(String cpf) {
        this.cpf = cpf;
        this.updatedAt = new Date();
    }

    public ObjectId getEstablishmentId() { return establishmentId; }
    public void setEstablishmentId(ObjectId establishmentId) {
        this.establishmentId = establishmentId;
        this.updatedAt = new Date();
    }

    public String getRole() { return role; }
    public void setRole(String role) {
        this.role = role;
        this.updatedAt = new Date();
    }

    public String getAuthProvider() { return authProvider; }
    public void setAuthProvider(String authProvider) {
        this.authProvider = authProvider;
        this.updatedAt = new Date();
    }

    public Date getCreatedAt() { return createdAt; }
    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }

    public Date getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Date updatedAt) { this.updatedAt = updatedAt; }

    public boolean isActive() { return isActive; }
    public void setActive(boolean active) {
        isActive = active;
        this.updatedAt = new Date();
    }

    public String getRememberToken() { return rememberToken; }
    public void setRememberToken(String rememberToken) {
        this.rememberToken = rememberToken;
        this.updatedAt = new Date();
    }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", email='" + email + '\'' +
                ", role='" + role + '\'' +
                ", isActive=" + isActive +
                '}';
    }
}
package com.nextis.examples;

import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Sorts;
import com.mongodb.client.model.Updates;
import com.nextis.config.MongoDBConnection;
import org.bson.Document;
import org.bson.types.ObjectId;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import static com.mongodb.client.model.Filters.*;
import static com.mongodb.client.model.Updates.*;

/**
 * Exemplos práticos de operações no sistema ComandOU
 */
public class ComandOUOperations {

    private MongoDatabase database;
    private MongoCollection<Document> menuCollection;
    private MongoCollection<Document> ordersCollection;

    public ComandOUOperations() {
        this.database = MongoDBConnection.getInstance().getDatabase();
        this.menuCollection = database.getCollection("menu_items");
        this.ordersCollection = database.getCollection("orders");
    }

    // ==================== OPERAÇÕES DE CARDÁPIO ====================

    public List<Document> getAvailableMenuItems() {
        List<Document> items = new ArrayList<>();

        menuCollection.find(
                        and(
                                eq("is_available", true),
                                gt("available_quantity", 0)
                        )
                )
                .sort(Sorts.ascending("category", "name"))
                .into(items);

        System.out.println("✓ Encontrados " + items.size() + " itens disponíveis");
        return items;
    }

    public List<Document> getMenuItemsByCategory(String category) {
        List<Document> items = new ArrayList<>();

        menuCollection.find(
                        and(
                                eq("category", category),
                                eq("is_available", true)
                        )
                )
                .sort(Sorts.ascending("name"))
                .into(items);

        System.out.println("✓ Encontrados " + items.size() + " itens na categoria: " + category);
        return items;
    }

    public Document getMenuItemByName(String name) {
        Document item = menuCollection.find(eq("name", name)).first();

        if (item != null) {
            System.out.println("✓ Item encontrado: " + name);
        } else {
            System.out.println("✗ Item não encontrado: " + name);
        }

        return item;
    }

    public List<Document> getLowStockItems() {
        List<Document> items = new ArrayList<>();

        menuCollection.find(eq("is_low_stock", true))
                .sort(Sorts.ascending("available_quantity"))
                .into(items);

        System.out.println("⚠ " + items.size() + " itens com estoque baixo");

        for (Document item : items) {
            System.out.println("  - " + item.getString("name") +
                    ": " + item.getInteger("available_quantity") + " unidades");
        }

        return items;
    }

    public boolean updateItemQuantity(String itemName, int newQuantity) {
        try {
            Document result = (Document) menuCollection.findOneAndUpdate(
                    eq("name", itemName),
                    combine(
                            set("available_quantity", newQuantity),
                            set("is_low_stock", newQuantity <= 5),
                            set("updated_at", new Date())
                    )
            );

            if (result != null) {
                System.out.println("✓ Quantidade atualizada: " + itemName + " = " + newQuantity);
                return true;
            } else {
                System.out.println("✗ Item não encontrado: " + itemName);
                return false;
            }
        } catch (Exception e) {
            System.err.println("✗ Erro ao atualizar quantidade: " + e.getMessage());
            return false;
        }
    }

    public boolean decreaseItemQuantity(ObjectId itemId, int quantity) {
        try {
            Document item = menuCollection.find(eq("_id", itemId)).first();

            if (item == null) {
                System.out.println("✗ Item não encontrado");
                return false;
            }

            int currentQty = item.getInteger("available_quantity");
            int newQty = currentQty - quantity;

            if (newQty < 0) {
                System.out.println("✗ Quantidade insuficiente em estoque");
                return false;
            }

            menuCollection.updateOne(
                    eq("_id", itemId),
                    combine(
                            set("available_quantity", newQty),
                            set("is_low_stock", newQty <= 5),
                            set("updated_at", new Date())
                    )
            );

            System.out.println("✓ Estoque reduzido: " + quantity + " unidade(s)");
            return true;

        } catch (Exception e) {
            System.err.println("✗ Erro ao reduzir estoque: " + e.getMessage());
            return false;
        }
    }

    public boolean updateItemPrice(String itemName, double newPrice) {
        try {
            menuCollection.updateOne(
                    eq("name", itemName),
                    combine(
                            set("price_options.simple_price", newPrice),
                            set("updated_at", new Date())
                    )
            );

            System.out.println("✓ Preço atualizado: " + itemName + " = R$ " + newPrice);
            return true;

        } catch (Exception e) {
            System.err.println("✗ Erro ao atualizar preço: " + e.getMessage());
            return false;
        }
    }

    public boolean setItemUnavailable(String itemName) {
        try {
            menuCollection.updateOne(
                    eq("name", itemName),
                    combine(
                            set("is_available", false),
                            set("updated_at", new Date())
                    )
            );

            System.out.println("✓ Item marcado como indisponível: " + itemName);
            return true;

        } catch (Exception e) {
            System.err.println("✗ Erro ao marcar item: " + e.getMessage());
            return false;
        }
    }

    // ==================== OPERAÇÕES DE PEDIDOS ====================

    public ObjectId createOrder(String tableNumber, String customerName,
                                List<Document> items) {
        try {
            double subtotal = 0.0;
            for (Document item : items) {
                subtotal += item.getDouble("subtotal");
            }

            double serviceCharge = subtotal * 0.10;
            double total = subtotal + serviceCharge;

            Document order = new Document()
                    .append("establishment_id", new ObjectId())
                    .append("table_number", tableNumber)
                    .append("customer_name", customerName)
                    .append("items", items)
                    .append("subtotal", subtotal)
                    .append("service_charge", serviceCharge)
                    .append("total", total)
                    .append("status", "pending")
                    .append("payment_status", "pending")
                    .append("created_at", new Date())
                    .append("updated_at", new Date());

            ordersCollection.insertOne(order);
            ObjectId orderId = order.getObjectId("_id");

            System.out.println("✓ Pedido criado: #" + orderId);
            System.out.println("  Mesa: " + tableNumber);
            System.out.println("  Total: R$ " + String.format("%.2f", total));

            return orderId;

        } catch (Exception e) {
            System.err.println("✗ Erro ao criar pedido: " + e.getMessage());
            return null;
        }
    }

    public List<Document> getOrdersByStatus(String status) {
        List<Document> orders = new ArrayList<>();

        ordersCollection.find(eq("status", status))
                .sort(Sorts.ascending("created_at"))
                .into(orders);

        System.out.println("✓ Encontrados " + orders.size() + " pedidos com status: " + status);
        return orders;
    }

    public List<Document> getPendingOrders() {
        return getOrdersByStatus("pending");
    }

    public List<Document> getPreparingOrders() {
        return getOrdersByStatus("preparing");
    }

    public List<Document> getReadyOrders() {
        return getOrdersByStatus("ready");
    }

    public List<Document> getOrdersByTable(String tableNumber) {
        List<Document> orders = new ArrayList<>();

        ordersCollection.find(
                        and(
                                eq("table_number", tableNumber),
                                nin("status", "delivered", "cancelled")
                        )
                )
                .sort(Sorts.descending("created_at"))
                .into(orders);

        System.out.println("✓ Mesa " + tableNumber + " tem " + orders.size() + " pedido(s) ativo(s)");
        return orders;
    }

    public boolean updateOrderStatus(ObjectId orderId, String newStatus) {
        try {
            Document update = new Document()
                    .append("status", newStatus)
                    .append("updated_at", new Date());

            if (newStatus.equals("ready")) {
                update.append("prepared_at", new Date());
            } else if (newStatus.equals("delivered")) {
                update.append("delivered_at", new Date());
            }

            ordersCollection.updateOne(
                    eq("_id", orderId),
                    new Document("$set", update)
            );

            System.out.println("✓ Status do pedido atualizado: " + newStatus);
            return true;

        } catch (Exception e) {
            System.err.println("✗ Erro ao atualizar status: " + e.getMessage());
            return false;
        }
    }

    public boolean markOrderAsPaid(ObjectId orderId, String paymentMethod) {
        try {
            ordersCollection.updateOne(
                    eq("_id", orderId),
                    combine(
                            set("payment_status", "paid"),
                            set("payment_method", paymentMethod),
                            set("completed_at", new Date()),
                            set("updated_at", new Date())
                    )
            );

            System.out.println("✓ Pedido marcado como pago (" + paymentMethod + ")");
            return true;

        } catch (Exception e) {
            System.err.println("✗ Erro ao marcar pagamento: " + e.getMessage());
            return false;
        }
    }

    public boolean cancelOrder(ObjectId orderId) {
        try {
            ordersCollection.updateOne(
                    eq("_id", orderId),
                    combine(
                            set("status", "cancelled"),
                            set("payment_status", "cancelled"),
                            set("updated_at", new Date())
                    )
            );

            System.out.println("✓ Pedido cancelado");
            return true;

        } catch (Exception e) {
            System.err.println("✗ Erro ao cancelar pedido: " + e.getMessage());
            return false;
        }
    }

    public List<Document> getTodayOrders() {
        List<Document> orders = new ArrayList<>();

        Date startOfDay = new Date();
        startOfDay.setHours(0);
        startOfDay.setMinutes(0);
        startOfDay.setSeconds(0);

        ordersCollection.find(gte("created_at", startOfDay))
                .sort(Sorts.descending("created_at"))
                .into(orders);

        System.out.println("✓ Pedidos de hoje: " + orders.size());
        return orders;
    }

    public double getTodayRevenue() {
        Date startOfDay = new Date();
        startOfDay.setHours(0);
        startOfDay.setMinutes(0);
        startOfDay.setSeconds(0);

        List<Document> pipeline = List.of(
                new Document("$match", new Document()
                        .append("created_at", new Document("$gte", startOfDay))
                        .append("payment_status", "paid")),
                new Document("$group", new Document()
                        .append("_id", null)
                        .append("total", new Document("$sum", "$total")))
        );

        Document result = ordersCollection.aggregate(pipeline).first();

        if (result != null) {
            double total = result.getDouble("total");
            System.out.println("💰 Faturamento hoje: R$ " + String.format("%.2f", total));
            return total;
        }

        return 0.0;
    }

    public void showDashboard() {
        System.out.println("\n" + "=".repeat(50));
        System.out.println("📊 DASHBOARD COMANDOU");
        System.out.println("=".repeat(50));

        long pending = ordersCollection.countDocuments(eq("status", "pending"));
        long preparing = ordersCollection.countDocuments(eq("status", "preparing"));
        long ready = ordersCollection.countDocuments(eq("status", "ready"));

        System.out.println("\n🔔 PEDIDOS ATIVOS:");
        System.out.println("  Pendentes: " + pending);
        System.out.println("  Em Preparo: " + preparing);
        System.out.println("  Prontos: " + ready);

        long lowStock = menuCollection.countDocuments(eq("is_low_stock", true));
        System.out.println("\n⚠️  ALERTAS DE ESTOQUE:");
        System.out.println("  Itens com estoque baixo: " + lowStock);

        double revenue = getTodayRevenue();
        System.out.println("\n💰 FATURAMENTO HOJE:");
        System.out.println("  R$ " + String.format("%.2f", revenue));

        System.out.println("\n" + "=".repeat(50) + "\n");
    }

    public static void main(String[] args) {
        System.out.println("🍷 Exemplos de Operações ComandOU\n");

        ComandOUOperations ops = new ComandOUOperations();

        try {
            ops.showDashboard();

            System.out.println("📋 Cervejas disponíveis:");
            List<Document> cervejas = ops.getMenuItemsByCategory("Cervejas");
            for (Document cerveja : cervejas) {
                System.out.println("  - " + cerveja.getString("name") +
                        " (R$ " + cerveja.get("price_options", Document.class)
                        .getDouble("simple_price") + ")");
            }
            System.out.println();

            System.out.println("⚠️  Alertas de Estoque:");
            ops.getLowStockItems();
            System.out.println();

            System.out.println("👨‍🍳 Pedidos em Preparo:");
            List<Document> preparing = ops.getPreparingOrders();
            for (Document order : preparing) {
                System.out.println("  Mesa " + order.getString("table_number") +
                        " - R$ " + String.format("%.2f", order.getDouble("total")));
            }
            System.out.println();

            System.out.println("✅ Pedidos Prontos:");
            List<Document> ready = ops.getReadyOrders();
            for (Document order : ready) {
                System.out.println("  Mesa " + order.getString("table_number") +
                        " - R$ " + String.format("%.2f", order.getDouble("total")));
            }

        } catch (Exception e) {
            System.err.println("❌ Erro: " + e.getMessage());
            e.printStackTrace();
        } finally {
            MongoDBConnection.getInstance().close();
        }
    }
}
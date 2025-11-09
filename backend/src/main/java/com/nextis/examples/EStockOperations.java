package com.nextis.examples;

import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Sorts;
import com.nextis.config.MongoDBConnection;
import org.bson.Document;
import org.bson.types.ObjectId;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import static com.mongodb.client.model.Filters.*;
import static com.mongodb.client.model.Updates.*;

/**
 * Exemplos práticos de operações no sistema eStock
 */
public class EStockOperations {

    private MongoDatabase database;
    private MongoCollection<Document> productCollection;
    private MongoCollection<Document> supplierCollection;
    private MongoCollection<Document> movementCollection;
    private MongoCollection<Document> salesCollection;
    private SimpleDateFormat dateFormat;

    public EStockOperations() {
        this.database = MongoDBConnection.getInstance().getDatabase();
        this.productCollection = database.getCollection("products");
        this.supplierCollection = database.getCollection("suppliers");
        this.movementCollection = database.getCollection("stock_movements");
        this.salesCollection = database.getCollection("sales");
        this.dateFormat = new SimpleDateFormat("dd/MM/yyyy");
    }

    // ==================== DASHBOARD ====================

    public void showDashboard() {
        System.out.println("\n" + "=".repeat(60));
        System.out.println("📊 DASHBOARD ESTOCK");
        System.out.println("=".repeat(60));

        // Total de produtos
        long totalProducts = productCollection.countDocuments();
        System.out.println("\n📦 TOTAL DE PRODUTOS: " + totalProducts);

        // Total de shots
        List<Document> shotsPipeline = List.of(
                new Document("$group", new Document()
                        .append("_id", null)
                        .append("total", new Document("$sum", "$total_shots")))
        );
        Document shotsResult = productCollection.aggregate(shotsPipeline).first();
        int totalShots = shotsResult != null ? shotsResult.getInteger("total", 0) : 0;
        System.out.println("🥃 TOTAL DE SHOTS: " + totalShots);

        // Vendas do dia
        Date startOfDay = getStartOfDay();
        double dailySales = calculateSales(startOfDay, new Date());
        System.out.println("\n💰 VENDAS:");
        System.out.println("  Hoje: R$ " + String.format("%.2f", dailySales));

        // Vendas do mês
        Date startOfMonth = getStartOfMonth();
        double monthlySales = calculateSales(startOfMonth, new Date());
        System.out.println("  Mês: R$ " + String.format("%.2f", monthlySales));

        // Vendas do ano
        Date startOfYear = getStartOfYear();
        double yearlySales = calculateSales(startOfYear, new Date());
        System.out.println("  Ano: R$ " + String.format("%.2f", yearlySales));

        // Alertas de estoque baixo
        long lowStockCount = productCollection.countDocuments(eq("low_stock_alert", true));
        System.out.println("\n⚠️  ALERTAS:");
        System.out.println("  Produtos com estoque baixo: " + lowStockCount);

        System.out.println("\n" + "=".repeat(60) + "\n");
    }

    // ==================== PRODUTOS ====================

    public List<Document> getAllProducts() {
        List<Document> products = new ArrayList<>();

        productCollection.find()
                .sort(Sorts.ascending("name"))
                .into(products);

        System.out.println("✓ Total de produtos: " + products.size());
        return products;
    }

    public List<Document> getProductsByCategory(String category) {
        List<Document> products = new ArrayList<>();

        productCollection.find(eq("category", category))
                .sort(Sorts.ascending("name"))
                .into(products);

        System.out.println("✓ Produtos na categoria '" + category + "': " + products.size());
        return products;
    }

    public List<Document> getLowStockProducts() {
        List<Document> products = new ArrayList<>();

        productCollection.find(eq("low_stock_alert", true))
                .sort(Sorts.ascending("quantity"))
                .into(products);

        System.out.println("⚠️  Produtos com estoque baixo: " + products.size());

        for (Document product : products) {
            System.out.println("  - " + product.getString("name") +
                    ": " + product.getInteger("quantity") + " unidades");
        }

        return products;
    }

    public List<Document> getTop5Products() {
        List<Document> products = new ArrayList<>();

        productCollection.find()
                .sort(Sorts.descending("quantity"))
                .limit(5)
                .into(products);

        System.out.println("\n📈 Top 5 Produtos em Estoque:");
        for (Document product : products) {
            System.out.println("  " + product.getString("name") +
                    ": " + product.getInteger("quantity") + " unidades");
        }

        return products;
    }

    public boolean addProduct(String name, int quantity, int capacityMl, int shotSizeMl,
                              Date expirationDate, String supplierName, String category,
                              String sku, double costPrice, double salePrice) {
        try {
            // Buscar ID do fornecedor
            Document supplier = supplierCollection.find(eq("name", supplierName)).first();
            ObjectId supplierId = supplier != null ? supplier.getObjectId("_id") : null;

            int shotsPerUnit = capacityMl / shotSizeMl;
            int totalShots = shotsPerUnit * quantity;

            Document product = new Document()
                    .append("name", name)
                    .append("quantity", quantity)
                    .append("capacity_ml", capacityMl)
                    .append("shot_size_ml", shotSizeMl)
                    .append("shots_per_unit", shotsPerUnit)
                    .append("total_shots", totalShots)
                    .append("expiration_date", expirationDate)
                    .append("supplier", supplierName)
                    .append("supplier_id", supplierId)
                    .append("category", category)
                    .append("sku", sku)
                    .append("min_stock_level", 5)
                    .append("max_stock_level", 30)
                    .append("low_stock_alert", quantity <= 5)
                    .append("cost_price", costPrice)
                    .append("sale_price", salePrice)
                    .append("created_at", new Date())
                    .append("updated_at", new Date());

            productCollection.insertOne(product);
            System.out.println("✓ Produto adicionado: " + name);

            // Registrar movimentação
            registerMovement(product.getObjectId("_id"), name, "ENTRADA", quantity,
                    "Cadastro inicial", "Sistema");

            return true;

        } catch (Exception e) {
            System.err.println("✗ Erro ao adicionar produto: " + e.getMessage());
            return false;
        }
    }

    public boolean updateProductQuantity(String productName, int newQuantity) {
        try {
            Document product = productCollection.find(eq("name", productName)).first();

            if (product == null) {
                System.out.println("✗ Produto não encontrado: " + productName);
                return false;
            }

            int oldQuantity = product.getInteger("quantity");
            int difference = newQuantity - oldQuantity;

            int capacityMl = product.getInteger("capacity_ml");
            int shotSizeMl = product.getInteger("shot_size_ml");
            int shotsPerUnit = capacityMl / shotSizeMl;
            int totalShots = shotsPerUnit * newQuantity;

            productCollection.updateOne(
                    eq("name", productName),
                    combine(
                            set("quantity", newQuantity),
                            set("total_shots", totalShots),
                            set("low_stock_alert", newQuantity <= 5),
                            set("updated_at", new Date())
                    )
            );

            System.out.println("✓ Quantidade atualizada: " + productName + " = " + newQuantity);

            // Registrar movimentação
            String movementType = difference > 0 ? "ENTRADA" : "SAIDA";
            String reason = difference > 0 ? "Reposição de estoque" : "Venda/Saída";
            registerMovement(product.getObjectId("_id"), productName, movementType,
                    Math.abs(difference), reason, "Sistema");

            return true;

        } catch (Exception e) {
            System.err.println("✗ Erro ao atualizar quantidade: " + e.getMessage());
            return false;
        }
    }

    public boolean updateProductShotSize(String productName, int newShotSize) {
        try {
            Document product = productCollection.find(eq("name", productName)).first();

            if (product == null) {
                System.out.println("✗ Produto não encontrado: " + productName);
                return false;
            }

            int quantity = product.getInteger("quantity");
            int capacityMl = product.getInteger("capacity_ml");
            int shotsPerUnit = capacityMl / newShotSize;
            int totalShots = shotsPerUnit * quantity;

            productCollection.updateOne(
                    eq("name", productName),
                    combine(
                            set("shot_size_ml", newShotSize),
                            set("shots_per_unit", shotsPerUnit),
                            set("total_shots", totalShots),
                            set("updated_at", new Date())
                    )
            );

            System.out.println("✓ Tamanho do shot atualizado: " + productName + " = " + newShotSize + "ml");
            return true;

        } catch (Exception e) {
            System.err.println("✗ Erro ao atualizar shot: " + e.getMessage());
            return false;
        }
    }

    // ==================== FORNECEDORES ====================

    public List<Document> getAllSuppliers() {
        List<Document> suppliers = new ArrayList<>();

        supplierCollection.find()
                .sort(Sorts.ascending("name"))
                .into(suppliers);

        System.out.println("✓ Total de fornecedores: " + suppliers.size());
        return suppliers;
    }

    public boolean addSupplier(String name, String contactPerson, String email, String phone) {
        try {
            Document supplier = new Document()
                    .append("name", name)
                    .append("contact_person", contactPerson)
                    .append("email", email)
                    .append("phone", phone)
                    .append("is_active", true)
                    .append("created_at", new Date())
                    .append("updated_at", new Date());

            supplierCollection.insertOne(supplier);
            System.out.println("✓ Fornecedor adicionado: " + name);
            return true;

        } catch (Exception e) {
            System.err.println("✗ Erro ao adicionar fornecedor: " + e.getMessage());
            return false;
        }
    }

    // ==================== MOVIMENTAÇÕES ====================

    public List<Document> getRecentMovements(int limit) {
        List<Document> movements = new ArrayList<>();

        movementCollection.find()
                .sort(Sorts.descending("movement_date"))
                .limit(limit)
                .into(movements);

        System.out.println("\n📋 Últimas " + limit + " Movimentações:");
        for (Document movement : movements) {
            System.out.println("  " + dateFormat.format(movement.getDate("movement_date")) +
                    " | " + movement.getString("product_name") +
                    " | " + movement.getString("type") +
                    " | " + movement.getInteger("quantity") + " unidades");
        }

        return movements;
    }

    private void registerMovement(ObjectId productId, String productName, String type,
                                  int quantity, String reason, String userName) {
        Document movement = new Document()
                .append("product_id", productId)
                .append("product_name", productName)
                .append("type", type)
                .append("quantity", quantity)
                .append("reason", reason)
                .append("user_name", userName)
                .append("movement_date", new Date())
                .append("created_at", new Date());

        movementCollection.insertOne(movement);
    }

    // ==================== VENDAS ====================

    private double calculateSales(Date startDate, Date endDate) {
        List<Document> pipeline = List.of(
                new Document("$match", new Document()
                        .append("sale_date", new Document()
                                .append("$gte", startDate)
                                .append("$lte", endDate))),
                new Document("$group", new Document()
                        .append("_id", null)
                        .append("total", new Document("$sum", "$total")))
        );

        Document result = salesCollection.aggregate(pipeline).first();
        return result != null ? result.getDouble("total") : 0.0;
    }

    public void showSalesReport() {
        System.out.println("\n" + "=".repeat(60));
        System.out.println("💰 RELATÓRIO DE VENDAS");
        System.out.println("=".repeat(60));

        Date today = new Date();
        Date startOfDay = getStartOfDay();
        Date startOfMonth = getStartOfMonth();
        Date startOfYear = getStartOfYear();

        double dailySales = calculateSales(startOfDay, today);
        double monthlySales = calculateSales(startOfMonth, today);
        double yearlySales = calculateSales(startOfYear, today);

        long dailyCount = salesCollection.countDocuments(
                and(gte("sale_date", startOfDay), lte("sale_date", today))
        );

        System.out.println("\n📅 Vendas de Hoje:");
        System.out.println("  Total: R$ " + String.format("%.2f", dailySales));
        System.out.println("  Quantidade: " + dailyCount + " vendas");

        System.out.println("\n📅 Vendas do Mês:");
        System.out.println("  Total: R$ " + String.format("%.2f", monthlySales));

        System.out.println("\n📅 Vendas do Ano:");
        System.out.println("  Total: R$ " + String.format("%.2f", yearlySales));

        System.out.println("\n" + "=".repeat(60) + "\n");
    }

    // ==================== UTILIDADES ====================

    private Date getStartOfDay() {
        Date date = new Date();
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        return date;
    }

    private Date getStartOfMonth() {
        Date date = new Date();
        date.setDate(1);
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        return date;
    }

    private Date getStartOfYear() {
        Date date = new Date();
        date.setMonth(0);
        date.setDate(1);
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        return date;
    }

    // ==================== MÉTODO MAIN PARA TESTES ====================

    public static void main(String[] args) {
        System.out.println("📦 Exemplos de Operações eStock\n");

        EStockOperations ops = new EStockOperations();

        try {
            // 1. Mostrar dashboard
            ops.showDashboard();

            // 2. Top 5 produtos em estoque
            ops.getTop5Products();
            System.out.println();

            // 3. Verificar alertas de estoque baixo
            System.out.println("⚠️  Alertas de Estoque:");
            ops.getLowStockProducts();
            System.out.println();

            // 4. Listar fornecedores
            System.out.println("👥 Fornecedores:");
            List<Document> suppliers = ops.getAllSuppliers();
            for (Document supplier : suppliers) {
                System.out.println("  - " + supplier.getString("name") +
                        " | Contato: " + supplier.getString("contact_person") +
                        " | Tel: " + supplier.getString("phone"));
            }
            System.out.println();

            // 5. Movimentações recentes
            ops.getRecentMovements(5);
            System.out.println();

            // 6. Relatório de vendas
            ops.showSalesReport();

            // 7. Produtos por categoria
            System.out.println("📋 Produtos por Categoria:");
            String[] categories = {"Vinhos", "Destilados", "Cervejas", "Petiscos", "Porções"};
            for (String category : categories) {
                long count = ops.database.getCollection("products")
                        .countDocuments(eq("category", category));
                System.out.println("  " + category + ": " + count + " produtos");
            }

              // Atualizar quantidade de um produto
              ops.updateProductQuantity("Cerveja Heineken Long Neck 330ml", 50);

              // Atualizar tamanho do shot
              ops.updateProductShotSize("Whisky Jack Daniels N. 7 1000ml", 60);

              // Adicionar novo fornecedor
              ops.addSupplier("Nova Distribuidora", "José Silva",
                              "jose@nova.com", "(11) 9999-8888");

              // Adicionar novo produto
              ops.addProduct("Vodka Nova 1000ml", 15, 1000, 50,
                            new Date(), "Distribuidora de Bebidas LTDA",
                            "Destilados", "VODK-002", 30.00, 50.00);


        } catch (Exception e) {
            System.err.println("❌ Erro: " + e.getMessage());
            e.printStackTrace();
        } finally {
            MongoDBConnection.getInstance().close();
        }
    }
}
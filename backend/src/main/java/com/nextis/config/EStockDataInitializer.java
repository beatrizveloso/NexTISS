package com.nextis.config;

import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.Document;
import org.bson.types.ObjectId;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Classe responsável por popular o banco com dados do eStock
 */
public class EStockDataInitializer {

    private MongoDatabase database;
    private ObjectId establishmentId;
    private SimpleDateFormat dateFormat;
    private Map<String, ObjectId> supplierIds;

    public EStockDataInitializer(ObjectId establishmentId) {
        this.database = MongoDBConnection.getInstance().getDatabase();
        this.establishmentId = establishmentId;
        this.dateFormat = new SimpleDateFormat("dd/MM/yyyy");
        this.supplierIds = new HashMap<>();
    }

    /**
     * Inicializa todos os dados do eStock
     */
    public void initializeEStockData() {
        System.out.println("\n📦 Inicializando dados do eStock...\n");

        insertSuppliers();
        insertProducts();
        insertStockMovements();
        insertSales();
        insertSystemSettings();

        System.out.println("✅ Dados do eStock inseridos com sucesso!\n");
    }

    /**
     * Insere fornecedores
     */
    private void insertSuppliers() {
        MongoCollection<Document> supplierCollection = database.getCollection("suppliers");

        if (supplierCollection.countDocuments() > 0) {
            System.out.println("  ℹ Fornecedores já existem no banco");
            // Carregar IDs existentes
            supplierCollection.find().forEach(doc -> {
                supplierIds.put(doc.getString("name"), doc.getObjectId("_id"));
            });
            return;
        }

        List<Document> suppliers = new ArrayList<>();

        suppliers.add(createSupplier(
                "Distribuidora de Bebidas LTDA",
                "Carlos Silva",
                "contato@distribuidora.com",
                "(11) 1234-5678"
        ));

        suppliers.add(createSupplier(
                "Importadora de Vinhos",
                "Ana Santos",
                "vendas@importvinhos.com",
                "(11) 9876-5432"
        ));

        suppliers.add(createSupplier(
                "Cervejaria Nacional",
                "Pedro Almeida",
                "pedro@cervejarianacional.com",
                "(11) 5555-9999"
        ));

        suppliers.add(createSupplier(
                "Águas Puras",
                "Maria Oliveira",
                "vendas@aguaspuras.com",
                "(11) 4444-8888"
        ));

        suppliers.add(createSupplier(
                "Petiscos & Companhia",
                "João Santos",
                "joao@petiscos.com",
                "(11) 3333-7777"
        ));

        supplierCollection.insertMany(suppliers);

        // Armazenar IDs dos fornecedores
        supplierCollection.find().forEach(doc -> {
            supplierIds.put(doc.getString("name"), doc.getObjectId("_id"));
        });

        System.out.println("  ✓ 5 fornecedores inseridos");
    }

    /**
     * Insere produtos do estoque
     */
    private void insertProducts() {
        MongoCollection<Document> productCollection = database.getCollection("products");

        if (productCollection.countDocuments() > 0) {
            System.out.println("  ℹ Produtos já existem no banco");
            return;
        }

        List<Document> products = new ArrayList<>();

        // Bebidas
        products.add(createProduct("Vinho Bordô Suave Tradição 1000ml", 10, 1000, 50, "30/12/2024", "Distribuidora de Bebidas LTDA", "Vinhos", "VINHO-001", 25.00, 45.00));
        products.add(createProduct("Whisky Jack Daniels N. 7 1000ml", 8, 1000, 50, "14/11/2025", "Distribuidora de Bebidas LTDA", "Destilados", "WHISK-001", 90.00, 145.00));
        products.add(createProduct("Cerveja Heineken Long Neck 330ml", 24, 330, 330, "29/10/2023", "Importadora de Vinhos", "Cervejas", "CERV-001", 4.50, 7.49));
        products.add(createProduct("Vodka Smirnoff 998ml", 12, 998, 50, "19/08/2024", "Distribuidora de Bebidas LTDA", "Destilados", "VODK-001", 25.00, 39.99));
        products.add(createProduct("Gin Rock's Strawberry 700ml", 6, 700, 50, "14/05/2024", "Importadora de Vinhos", "Destilados", "GIN-001", 28.00, 45.00));
        products.add(createProduct("Tequila Jose Cuervo Especial Gold 750ml", 7, 750, 50, "19/09/2024", "Distribuidora de Bebidas LTDA", "Destilados", "TEQU-001", 105.00, 169.00));
        products.add(createProduct("Rum Explorer Trinidad 700ml", 5, 700, 50, "14/01/2025", "Importadora de Vinhos", "Destilados", "RUM-001", 155.00, 245.13));
        products.add(createProduct("Licor Sheridans Coffee Layered Liqueur 700ml", 4, 700, 50, "29/11/2024", "Distribuidora de Bebidas LTDA", "Licores", "LICO-001", 125.00, 199.00));
        products.add(createProduct("Conhaque Hennessy Very Special 700ml", 2, 700, 50, "09/03/2026", "Distribuidora de Bebidas LTDA", "Destilados", "CONH-001", 295.00, 480.00));
        products.add(createProduct("Champagne Veuve Clicquot Brut 750ml", 9, 750, 50, "24/07/2024", "Importadora de Vinhos", "Espumantes", "CHAM-001", 320.00, 519.90));
        products.add(createProduct("Caneca De Vidro Roma Para Chopp 345ml", 15, 345, 345, "30/12/2024", "Cervejaria Nacional", "Chopp", "CHOP-001", 18.00, 28.50));
        products.add(createProduct("Cerveja Skol Lata 269ml", 36, 269, 269, "30/12/2023", "Cervejaria Nacional", "Cervejas", "CERV-002", 2.00, 3.39));
        products.add(createProduct("Cerveja Budweiser American Lager 350ml", 30, 350, 350, "30/12/2023", "Cervejaria Nacional", "Cervejas", "CERV-003", 2.50, 4.29));
        products.add(createProduct("Água Mineral Minalba 510ml Sem Gás", 20, 510, 510, "30/12/2024", "Águas Puras", "Águas", "AGUA-001", 1.50, 2.50));
        products.add(createProduct("Água Mineral Com Gás Garrafa 500ml Crystal", 18, 500, 500, "30/12/2024", "Águas Puras", "Águas", "AGUA-002", 2.00, 3.50));

        // Petiscos
        products.add(createProduct("Amendoim 100g", 15, 100, 100, "29/10/2023", "Petiscos & Companhia", "Petiscos", "PETI-001", 5.00, 8.00));
        products.add(createProduct("Mix Castanhas 150g", 12, 150, 150, "14/11/2023", "Petiscos & Companhia", "Petiscos", "PETI-002", 9.00, 15.00));
        products.add(createProduct("Batata Chips 120g", 20, 120, 120, "19/10/2023", "Petiscos & Companhia", "Petiscos", "PETI-003", 6.00, 10.00));
        products.add(createProduct("Salame 100g", 8, 100, 100, "29/09/2023", "Petiscos & Companhia", "Petiscos", "PETI-004", 11.00, 18.00));
        products.add(createProduct("Queijos 150g", 10, 150, 150, "24/09/2023", "Petiscos & Companhia", "Petiscos", "PETI-005", 15.00, 25.00));
        products.add(createProduct("Azeitonas 100g", 18, 100, 100, "09/11/2023", "Petiscos & Companhia", "Petiscos", "PETI-006", 7.00, 12.00));

        // Porções
        products.add(createProduct("Batata Frita 200g", 25, 200, 200, "04/10/2023", "Petiscos & Companhia", "Porções", "PORC-001", 12.00, 20.00));
        products.add(createProduct("Mandioca Frita 200g", 15, 200, 200, "09/10/2023", "Petiscos & Companhia", "Porções", "PORC-002", 13.00, 22.00));
        products.add(createProduct("Frango a Passarinho 250g", 12, 250, 250, "19/09/2023", "Petiscos & Companhia", "Porções", "PORC-003", 17.00, 28.00));
        products.add(createProduct("Isca de Peixe 250g", 10, 250, 250, "14/09/2023", "Petiscos & Companhia", "Porções", "PORC-004", 20.00, 32.00));
        products.add(createProduct("Linguiça Acebolada 200g", 14, 200, 200, "14/10/2023", "Petiscos & Companhia", "Porções", "PORC-005", 16.00, 26.00));
        products.add(createProduct("Torresmo 150g", 20, 150, 150, "24/10/2023", "Petiscos & Companhia", "Porções", "PORC-006", 11.00, 18.00));
        products.add(createProduct("Queijo Coalho 200g", 16, 200, 200, "27/09/2023", "Petiscos & Companhia", "Porções", "PORC-007", 15.00, 24.00));
        products.add(createProduct("Onion Rings 150g", 18, 150, 150, "07/10/2023", "Petiscos & Companhia", "Porções", "PORC-008", 10.00, 16.00));

        productCollection.insertMany(products);
        System.out.println("  ✓ " + products.size() + " produtos inseridos");
    }

    /**
     * Cria documento de fornecedor
     */
    private Document createSupplier(String name, String contactPerson, String email, String phone) {
        return new Document()
                .append("establishment_id", establishmentId)
                .append("name", name)
                .append("contact_person", contactPerson)
                .append("email", email)
                .append("phone", phone)
                .append("is_active", true)
                .append("created_at", new Date())
                .append("updated_at", new Date());
    }

    /**
     * Cria documento de produto
     */
    private Document createProduct(String name, int quantity, int capacityMl, int shotSizeMl,
                                   String expirationDate, String supplierName, String category,
                                   String sku, double costPrice, double salePrice) {

        ObjectId supplierId = supplierIds.get(supplierName);
        Date expDate = null;

        try {
            expDate = dateFormat.parse(expirationDate);
        } catch (ParseException e) {
            System.err.println("Erro ao parsear data: " + expirationDate);
            expDate = new Date();
        }

        int shotsPerUnit = capacityMl / shotSizeMl;
        int totalShots = shotsPerUnit * quantity;
        boolean lowStockAlert = quantity <= 5;

        return new Document()
                .append("establishment_id", establishmentId)
                .append("name", name)
                .append("quantity", quantity)
                .append("capacity_ml", capacityMl)
                .append("shot_size_ml", shotSizeMl)
                .append("shots_per_unit", shotsPerUnit)
                .append("total_shots", totalShots)
                .append("expiration_date", expDate)
                .append("supplier", supplierName)
                .append("supplier_id", supplierId)
                .append("category", category)
                .append("sku", sku)
                .append("min_stock_level", 5)
                .append("max_stock_level", 30)
                .append("low_stock_alert", lowStockAlert)
                .append("cost_price", costPrice)
                .append("sale_price", salePrice)
                .append("created_at", new Date())
                .append("updated_at", new Date());
    }

    /**
     * Insere movimentações de estoque
     */
    private void insertStockMovements() {
        MongoCollection<Document> movementCollection = database.getCollection("stock_movements");

        if (movementCollection.countDocuments() > 0) {
            System.out.println("  ℹ Movimentações já existem no banco");
            return;
        }

        List<Document> movements = new ArrayList<>();

        try {
            movements.add(createMovement(
                    "Vinho Bordô",
                    "ENTRADA",
                    10,
                    "Reposição de estoque",
                    "João Alberto",
                    dateFormat.parse("10/05/2023")
            ));

            movements.add(createMovement(
                    "Whisky Jack Daniels",
                    "SAIDA",
                    2,
                    "Venda realizada",
                    "Maria Silva",
                    dateFormat.parse("09/05/2023")
            ));

        } catch (ParseException e) {
            System.err.println("Erro ao parsear datas de movimentação");
        }

        movementCollection.insertMany(movements);
        System.out.println("  ✓ " + movements.size() + " movimentações inseridas");
    }

    /**
     * Cria documento de movimentação
     */
    private Document createMovement(String productName, String type, int quantity,
                                    String reason, String userName, Date movementDate) {
        return new Document()
                .append("establishment_id", establishmentId)
                .append("product_name", productName)
                .append("type", type)
                .append("quantity", quantity)
                .append("reason", reason)
                .append("user_name", userName)
                .append("movement_date", movementDate)
                .append("created_at", new Date());
    }

    /**
     * Insere vendas de exemplo
     */
    private void insertSales() {
        MongoCollection<Document> salesCollection = database.getCollection("sales");

        if (salesCollection.countDocuments() > 0) {
            System.out.println("  ℹ Vendas já existem no banco");
            return;
        }

        List<Document> sales = new ArrayList<>();

        // Vendas de hoje
        Date today = new Date();
        sales.add(createSale(150.00, "Cartão de Crédito", today, "João Alberto"));
        sales.add(createSale(85.50, "Dinheiro", today, "Maria Silva"));
        sales.add(createSale(230.00, "PIX", today, "João Alberto"));

        // Vendas do mês
        for (int i = 1; i <= 10; i++) {
            Date saleDate = new Date(today.getTime() - (i * 24 * 60 * 60 * 1000L));
            sales.add(createSale(Math.random() * 200 + 50, "Cartão de Crédito", saleDate, "João Alberto"));
        }

        salesCollection.insertMany(sales);
        System.out.println("  ✓ " + sales.size() + " vendas inseridas");
    }

    /**
     * Cria documento de venda
     */
    private Document createSale(double total, String paymentMethod, Date saleDate, String userName) {
        return new Document()
                .append("establishment_id", establishmentId)
                .append("total", total)
                .append("payment_method", paymentMethod)
                .append("sale_date", saleDate)
                .append("user_name", userName);
    }

    /**
     * Insere configurações do sistema
     */
    private void insertSystemSettings() {
        MongoCollection<Document> settingsCollection = database.getCollection("system_settings");

        if (settingsCollection.countDocuments() > 0) {
            System.out.println("  ℹ Configurações já existem no banco");
            return;
        }

        Document settings = new Document()
                .append("establishment_id", establishmentId)
                .append("email_notifications", true)
                .append("min_stock_alert", 5)
                .append("timezone", "America/Sao_Paulo")
                .append("currency", "BRL")
                .append("language", "pt-BR")
                .append("created_at", new Date())
                .append("updated_at", new Date());

        settingsCollection.insertOne(settings);
        System.out.println("  ✓ Configurações do sistema inseridas");
    }

    /**
     * Atualiza usuários com configurações eStock
     */
    public void updateUsersWithEStockSettings() {
        MongoCollection<Document> usersCollection = database.getCollection("users");

        // Atualizar usuário João Alberto
        usersCollection.updateOne(
                new Document("email", "joao.silva@demonextis.com.br"),
                new Document("$set", new Document()
                        .append("job_title", "Administrador")
                        .append("email_notifications", true)
                        .append("updated_at", new Date()))
        );

        // Atualizar usuário Maria Santos
        usersCollection.updateOne(
                new Document("email", "maria.santos@demonextis.com.br"),
                new Document("$set", new Document()
                        .append("job_title", "Estoquista")
                        .append("email_notifications", false)
                        .append("updated_at", new Date()))
        );

        System.out.println("  ✓ Usuários atualizados com configurações eStock");
    }
}
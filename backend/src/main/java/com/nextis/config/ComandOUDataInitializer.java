package com.nextis.config;

import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.Document;
import org.bson.types.ObjectId;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * Classe responsável por popular o banco com dados do cardápio ComandOU
 */
public class ComandOUDataInitializer {

    private MongoDatabase database;
    private ObjectId establishmentId;

    public ComandOUDataInitializer(ObjectId establishmentId) {
        this.database = MongoDBConnection.getInstance().getDatabase();
        this.establishmentId = establishmentId;
    }

    /**
     * Inicializa todos os dados do ComandOU
     */
    public void initializeComandOUData() {
        System.out.println("\n🍷 Inicializando dados do ComandOU...\n");

        insertMenuItems();

        System.out.println("✅ Dados do ComandOU inseridos com sucesso!\n");
    }

    /**
     * Insere todos os itens do cardápio
     */
    private void insertMenuItems() {
        MongoCollection<Document> menuCollection = database.getCollection("menu_items");

        if (menuCollection.countDocuments() > 0) {
            System.out.println("  ℹ Itens do cardápio já existem no banco");
            return;
        }

        List<Document> menuItems = new ArrayList<>();

        // VINHOS
        menuItems.add(createDrinkWithDoseAndBottle(
                "Vinho Bordô Suave Tradição 1000ml",
                "Vinho tinto suave da linha Tradição",
                "Vinhos", 1000, 10, 12.90, "Taça Padrão (150ml)", 150, 28.40
        ));

        // DESTILADOS
        menuItems.add(createDrinkWithDoseAndBottle(
                "Whisky Jack Daniels N. 7 1000ml",
                "Whisky Tennessee premium",
                "Destilados", 1000, 8, 25.90, "Dose Simples (50ml)", 50, 145.00
        ));

        menuItems.add(createDrinkWithDoseAndBottle(
                "Vodka Smirnoff 998ml",
                "Vodka premium destilada",
                "Destilados", 998, 12, 15.90, "Dose Simples (50ml)", 50, 39.99
        ));

        menuItems.add(createDrinkWithDoseAndBottle(
                "Gin Rock's Strawberry 700ml",
                "Gin com sabor de morango",
                "Destilados", 700, 6, 16.90, "Dose Simples (50ml)", 50, 45.00
        ));

        menuItems.add(createDrinkWithDoseAndBottle(
                "Tequila Jose Cuervo Especial Gold 750ml",
                "Tequila premium mexicana",
                "Destilados", 750, 7, 28.90, "Dose Simples (50ml)", 50, 169.00
        ));

        menuItems.add(createDrinkWithDoseAndBottle(
                "Rum Explorer Trinidad 700ml",
                "Rum premium das ilhas caribenhas",
                "Destilados", 700, 5, 35.90, "Dose Simples (50ml)", 50, 245.13
        ));

        menuItems.add(createDrinkWithDoseAndBottle(
                "Conhaque Hennessy Very Special 700ml",
                "Conhaque francês premium",
                "Destilados", 700, 2, 65.90, "Dose Simples (50ml)", 50, 480.00
        ));

        // LICORES
        menuItems.add(createDrinkWithDoseAndBottle(
                "Licor Sheridans Coffee Layered Liqueur 700ml",
                "Licor irlandês de café",
                "Licores", 700, 4, 22.90, "Dose (30ml)", 30, 199.00
        ));

        // ESPUMANTES
        menuItems.add(createDrinkWithDoseAndBottle(
                "Champagne Veuve Clicquot Brut 750ml",
                "Champagne francês brut",
                "Espumantes", 750, 9, 45.90, "Taça Flute (120ml)", 120, 519.90
        ));

        // CERVEJAS
        menuItems.add(createSimpleItem(
                "Cerveja Heineken Long Neck 330ml",
                "Cerveja pilsen premium importada",
                "Cervejas", 330, 24, 7.49
        ));

        menuItems.add(createSimpleItem(
                "Cerveja Skol Lata 269ml",
                "Cerveja pilsen brasileira",
                "Cervejas", 269, 36, 3.39
        ));

        menuItems.add(createSimpleItem(
                "Cerveja Budweiser American Lager 350ml",
                "Cerveja lager americana",
                "Cervejas", 350, 30, 4.29
        ));

        // CHOPP
        menuItems.add(createSimpleItem(
                "Caneca De Vidro Roma Para Chopp 345ml",
                "Caneca de vidro para chopp",
                "Chopp", 345, 15, 28.50
        ));

        // ÁGUAS
        menuItems.add(createSimpleItem(
                "Água Mineral Minalba 510ml Sem Gás",
                "Água mineral sem gás",
                "Águas", 510, 20, 2.50
        ));

        menuItems.add(createSimpleItem(
                "Água Mineral Com Gás Garrafa 500ml Crystal",
                "Água mineral com gás",
                "Águas", 500, 18, 3.50
        ));

        // PETISCOS
        menuItems.add(createFoodItem("Amendoim 100g", "Amendoim torrado e salgado", "Petiscos", 100, 15, 8.00));
        menuItems.add(createFoodItem("Mix Castanhas 150g", "Mix de castanhas e frutas secas", "Petiscos", 150, 12, 15.00));
        menuItems.add(createFoodItem("Batata Chips 120g", "Batata chips sabor original", "Petiscos", 120, 20, 10.00));
        menuItems.add(createFoodItem("Salame 100g", "Salame italiano fatiado", "Petiscos", 100, 8, 18.00));
        menuItems.add(createFoodItem("Queijos 150g", "Tabua de queijos variados", "Petiscos", 150, 10, 25.00));
        menuItems.add(createFoodItem("Azeitonas 100g", "Azeitonas verdes e pretas", "Petiscos", 100, 18, 12.00));

        // PORÇÕES
        menuItems.add(createFoodItem("Batata Frita 200g", "Porção de batata frita crocante", "Porções", 200, 25, 20.00));
        menuItems.add(createFoodItem("Mandioca Frita 200g", "Porção de mandioca frita", "Porções", 200, 15, 22.00));
        menuItems.add(createFoodItem("Frango a Passarinho 250g", "Porção de frango a passarinho", "Porções", 250, 12, 28.00));
        menuItems.add(createFoodItem("Isca de Peixe 250g", "Porção de isca de peixe", "Porções", 250, 10, 32.00));
        menuItems.add(createFoodItem("Linguiça Acebolada 200g", "Porção de linguiça acebolada", "Porções", 200, 14, 26.00));
        menuItems.add(createFoodItem("Torresmo 150g", "Porção de torresmo crocante", "Porções", 150, 20, 18.00));
        menuItems.add(createFoodItem("Queijo Coalho 200g", "Porção de queijo coalho grelhado", "Porções", 200, 16, 24.00));
        menuItems.add(createFoodItem("Onion Rings 150g", "Porção de anéis de cebola empanados", "Porções", 150, 18, 16.00));

        menuCollection.insertMany(menuItems);
        System.out.println("  ✓ " + menuItems.size() + " itens do cardápio inseridos");
    }

    private Document createDrinkWithDoseAndBottle(String name, String description, String category,
                                                  int volumeMl, int quantity, double dosePrice, String doseDescription,
                                                  int doseVolume, double bottlePrice) {

        return new Document()
                .append("establishment_id", establishmentId)
                .append("name", name)
                .append("description", description)
                .append("category", category)
                .append("available_quantity", quantity)
                .append("unit", "ml")
                .append("unit_size", volumeMl)
                .append("price_options", new Document()
                        .append("dose_price", new Document()
                                .append("price", dosePrice)
                                .append("description", doseDescription)
                                .append("volume_ml", doseVolume))
                        .append("bottle_price", bottlePrice))
                .append("serving_info", new Document()
                        .append("glass_type", doseDescription)
                        .append("serving_size", doseVolume))
                .append("low_stock_threshold", 5)
                .append("is_low_stock", quantity <= 5)
                .append("is_available", true)
                .append("created_at", new Date())
                .append("updated_at", new Date());
    }

    private Document createSimpleItem(String name, String description, String category,
                                      int size, int quantity, double price) {

        String unit = category.equals("Águas") || category.equals("Cervejas") ||
                category.equals("Chopp") ? "ml" : "g";

        return new Document()
                .append("establishment_id", establishmentId)
                .append("name", name)
                .append("description", description)
                .append("category", category)
                .append("available_quantity", quantity)
                .append("unit", unit)
                .append("unit_size", size)
                .append("price_options", new Document()
                        .append("simple_price", price))
                .append("low_stock_threshold", 5)
                .append("is_low_stock", quantity <= 5)
                .append("is_available", true)
                .append("created_at", new Date())
                .append("updated_at", new Date());
    }

    private Document createFoodItem(String name, String description, String category,
                                    int weightGrams, int quantity, double price) {

        return new Document()
                .append("establishment_id", establishmentId)
                .append("name", name)
                .append("description", description)
                .append("category", category)
                .append("available_quantity", quantity)
                .append("unit", "g")
                .append("unit_size", weightGrams)
                .append("price_options", new Document()
                        .append("simple_price", price))
                .append("low_stock_threshold", 5)
                .append("is_low_stock", quantity <= 5)
                .append("is_available", true)
                .append("created_at", new Date())
                .append("updated_at", new Date());
    }

    public void insertSampleOrders() {
        MongoCollection<Document> ordersCollection = database.getCollection("orders");

        if (ordersCollection.countDocuments() > 0) {
            System.out.println("  ℹ Pedidos de exemplo já existem");
            return;
        }

        MongoCollection<Document> menuCollection = database.getCollection("menu_items");
        List<Document> menuItems = new ArrayList<>();
        menuCollection.find().limit(5).into(menuItems);

        if (menuItems.isEmpty()) {
            System.out.println("  ⚠ Nenhum item no cardápio para criar pedidos");
            return;
        }

        Document order1 = new Document()
                .append("establishment_id", establishmentId)
                .append("table_number", "5")
                .append("customer_name", "João Silva")
                .append("items", List.of(
                        new Document()
                                .append("menu_item_id", menuItems.get(0).getObjectId("_id"))
                                .append("name", menuItems.get(0).getString("name"))
                                .append("order_type", "dose")
                                .append("quantity", 2)
                                .append("unit_price", 12.90)
                                .append("subtotal", 25.80)
                                .append("notes", "")
                ))
                .append("subtotal", 25.80)
                .append("service_charge", 2.58)
                .append("total", 28.38)
                .append("status", "preparing")
                .append("payment_status", "pending")
                .append("created_at", new Date(System.currentTimeMillis() - 600000))
                .append("updated_at", new Date());

        Document order2 = new Document()
                .append("establishment_id", establishmentId)
                .append("table_number", "12")
                .append("customer_name", "Maria Santos")
                .append("items", List.of(
                        new Document()
                                .append("menu_item_id", menuItems.get(1).getObjectId("_id"))
                                .append("name", menuItems.get(1).getString("name"))
                                .append("order_type", "simples")
                                .append("quantity", 3)
                                .append("unit_price", 7.49)
                                .append("subtotal", 22.47)
                                .append("notes", "Bem gelada")
                ))
                .append("subtotal", 22.47)
                .append("service_charge", 2.25)
                .append("total", 24.72)
                .append("status", "ready")
                .append("payment_status", "pending")
                .append("prepared_at", new Date())
                .append("created_at", new Date(System.currentTimeMillis() - 900000))
                .append("updated_at", new Date());

        ordersCollection.insertMany(List.of(order1, order2));
        System.out.println("  ✓ 2 pedidos de exemplo inseridos");
    }
}
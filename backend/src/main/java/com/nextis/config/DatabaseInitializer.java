package com.nextis.config;

import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.IndexOptions;
import com.mongodb.client.model.Indexes;
import org.bson.Document;

/**
 * Classe responsável por inicializar o banco de dados
 * Cria as collections e índices necessários
 */
public class DatabaseInitializer {

    private MongoDatabase database;

    public DatabaseInitializer() {
        this.database = MongoDBConnection.getInstance().getDatabase();
    }

    /**
     * Inicializa todas as collections do banco
     */
    public void initializeDatabase() {
        System.out.println("\n🚀 Iniciando criação do banco de dados...\n");

        createCollections();
        createIndexes();
        insertSampleData();

        System.out.println("\n✅ Banco de dados inicializado com sucesso!\n");
    }

    /**
     * Cria todas as collections necessárias
     */
    private void createCollections() {
        System.out.println("📁 Criando collections...");

        String[] collections = {
                "users",
                "plans",
                "subscriptions",
                "establishments",
                "products",
                "menu_items",
                "orders"
        };

        for (String collectionName : collections) {
            try {
                // Verifica se a collection já existe
                boolean exists = database.listCollectionNames()
                        .into(new java.util.ArrayList<>())
                        .contains(collectionName);

                if (!exists) {
                    database.createCollection(collectionName);
                    System.out.println("  ✓ Collection '" + collectionName + "' criada");
                } else {
                    System.out.println("  ℹ Collection '" + collectionName + "' já existe");
                }
            } catch (Exception e) {
                System.err.println("  ✗ Erro ao criar '" + collectionName + "': " + e.getMessage());
            }
        }
        System.out.println();
    }

    /**
     * Cria os índices para otimizar as consultas
     */
    private void createIndexes() {
        System.out.println("🔍 Criando índices...");

        // Índices para users
        MongoCollection<Document> usersCollection = database.getCollection("users");
        usersCollection.createIndex(
                Indexes.ascending("email"),
                new IndexOptions().unique(true)
        );
        usersCollection.createIndex(Indexes.ascending("establishment_id"));
        usersCollection.createIndex(
                Indexes.ascending("cpf"),
                new IndexOptions().unique(true).sparse(true)
        );
        System.out.println("  ✓ Índices criados para 'users'");

        // Índices para subscriptions
        MongoCollection<Document> subsCollection = database.getCollection("subscriptions");
        subsCollection.createIndex(Indexes.ascending("user_id"));
        subsCollection.createIndex(Indexes.ascending("establishment_id"));
        subsCollection.createIndex(Indexes.ascending("status"));
        subsCollection.createIndex(Indexes.ascending("end_date"));
        System.out.println("  ✓ Índices criados para 'subscriptions'");

        // Índices para products
        MongoCollection<Document> productsCollection = database.getCollection("products");
        productsCollection.createIndex(Indexes.ascending("establishment_id"));
        productsCollection.createIndex(
                Indexes.ascending("sku"),
                new IndexOptions().unique(true)
        );
        productsCollection.createIndex(Indexes.ascending("category"));
        System.out.println("  ✓ Índices criados para 'products'");

        // Índices para orders
        MongoCollection<Document> ordersCollection = database.getCollection("orders");
        ordersCollection.createIndex(Indexes.ascending("establishment_id"));
        ordersCollection.createIndex(Indexes.ascending("status"));
        ordersCollection.createIndex(Indexes.descending("created_at"));
        System.out.println("  ✓ Índices criados para 'orders'");

        // Índices para menu_items
        MongoCollection<Document> menuCollection = database.getCollection("menu_items");
        menuCollection.createIndex(Indexes.ascending("establishment_id"));
        menuCollection.createIndex(Indexes.ascending("category"));
        System.out.println("  ✓ Índices criados para 'menu_items'");

        // Índices para establishments
        MongoCollection<Document> estabCollection = database.getCollection("establishments");
        estabCollection.createIndex(
                Indexes.ascending("cnpj"),
                new IndexOptions().unique(true)
        );
        estabCollection.createIndex(Indexes.ascending("owner_id"));
        System.out.println("  ✓ Índices criados para 'establishments'");

        // Índices para plans
        MongoCollection<Document> plansCollection = database.getCollection("plans");
        plansCollection.createIndex(Indexes.ascending("type"));
        plansCollection.createIndex(Indexes.ascending("product_range"));
        System.out.println("  ✓ Índices criados para 'plans'");

        System.out.println();
    }

    /**
     * Insere dados de exemplo no banco
     */
    private void insertSampleData() {
        System.out.println("📊 Inserindo dados de exemplo...");

        insertSamplePlans();
        insertSampleEstablishment();
        insertSampleUsers();
        insertComandOUData();

        System.out.println();
    }

    /**
     * Insere dados do cardápio ComandOU
     */
    private void insertComandOUData() {
        // Busca o ID do estabelecimento
        MongoCollection<Document> estabCollection = database.getCollection("establishments");
        Document establishment = estabCollection.find().first();

        if (establishment == null) {
            System.out.println("  ⚠ Estabelecimento não encontrado, pulando dados do ComandOU");
            return;
        }

        org.bson.types.ObjectId establishmentId = establishment.getObjectId("_id");

        // Inicializa os dados do ComandOU
        ComandOUDataInitializer comandouInit = new ComandOUDataInitializer(establishmentId);
        comandouInit.initializeComandOUData();
        comandouInit.insertSampleOrders();
    }

    /**
     * Insere planos de exemplo
     */
    private void insertSamplePlans() {
        MongoCollection<Document> plansCollection = database.getCollection("plans");

        // Verifica se já existem planos
        if (plansCollection.countDocuments() > 0) {
            System.out.println("  ℹ Planos já existem no banco");
            return;
        }

        // Plano 1: Comanda Virtual (0-100 produtos)
        Document plan1 = new Document()
                .append("name", "Comanda Virtual")
                .append("type", "comanda_virtual")
                .append("product_range", "0-100")
                .append("pricing", new Document()
                        .append("monthly", 69.90)
                        .append("quarterly", 188.73)
                        .append("annual", 671.04))
                .append("discounts", new Document()
                        .append("quarterly", 10)
                        .append("annual", 20))
                .append("features", java.util.Arrays.asList(
                        "Comanda virtual ilimitada",
                        "Cardápio digital completo",
                        "Gestão de pedidos em tempo real",
                        "Relatórios básicos de vendas"
                ))
                .append("description", "Sistema completo de comanda virtual e cardápio digital")
                .append("is_active", true)
                .append("created_at", new java.util.Date())
                .append("updated_at", new java.util.Date());

        // Plano 2: Controle de Estoque (0-100 produtos)
        Document plan2 = new Document()
                .append("name", "Controle de Estoque")
                .append("type", "controle_estoque")
                .append("product_range", "0-100")
                .append("pricing", new Document()
                        .append("monthly", 99.90)
                        .append("quarterly", 269.73)
                        .append("annual", 959.04))
                .append("discounts", new Document()
                        .append("quarterly", 10)
                        .append("annual", 20))
                .append("features", java.util.Arrays.asList(
                        "Controle de até 100 produtos",
                        "Alertas de estoque baixo",
                        "Gestão de fornecedores",
                        "Relatórios detalhados"
                ))
                .append("description", "Controle de estoque inteligente para empresas")
                .append("is_active", true)
                .append("created_at", new java.util.Date())
                .append("updated_at", new java.util.Date());

        // Plano 3: Combo Completo (0-100 produtos)
        Document plan3 = new Document()
                .append("name", "Combo Completo")
                .append("type", "combo_completo")
                .append("product_range", "0-100")
                .append("pricing", new Document()
                        .append("monthly", 149.90)
                        .append("quarterly", 404.73)
                        .append("annual", 1439.04))
                .append("discounts", new Document()
                        .append("quarterly", 10)
                        .append("annual", 20))
                .append("features", java.util.Arrays.asList(
                        "Comanda virtual + Controle de estoque",
                        "Economia de R$ 19,90/mês",
                        "Todas as funcionalidades dos dois sistemas",
                        "Suporte prioritário"
                ))
                .append("description", "Solução completa: ComandOU + eStock")
                .append("is_active", true)
                .append("created_at", new java.util.Date())
                .append("updated_at", new java.util.Date());

        plansCollection.insertMany(java.util.Arrays.asList(plan1, plan2, plan3));
        System.out.println("  ✓ 3 planos de exemplo inseridos");
    }

    /**
     * Insere estabelecimento de exemplo
     */
    private void insertSampleEstablishment() {
        MongoCollection<Document> estabCollection = database.getCollection("establishments");

        // Verifica se já existem estabelecimentos
        if (estabCollection.countDocuments() > 0) {
            System.out.println("  ℹ Estabelecimentos já existem no banco");
            return;
        }

        Document establishment = new Document()
                .append("name", "Restaurante Demo NexTIS")
                .append("trade_name", "Demo NexTIS")
                .append("cnpj", "12.345.678/0001-90")
                .append("address", new Document()
                        .append("street", "Av. Santo Amaro")
                        .append("number", "123")
                        .append("complement", "Sala 10")
                        .append("neighborhood", "Brooklin")
                        .append("city", "São Paulo")
                        .append("state", "SP")
                        .append("zip_code", "04506-000"))
                .append("contact", new Document()
                        .append("email", "contato@demonextis.com.br")
                        .append("phone", "(11) 3000-0000")
                        .append("whatsapp", "(11) 94002-8922"))
                .append("settings", new Document()
                        .append("timezone", "America/Sao_Paulo")
                        .append("currency", "BRL")
                        .append("language", "pt-BR"))
                .append("is_active", true)
                .append("created_at", new java.util.Date())
                .append("updated_at", new java.util.Date());

        estabCollection.insertOne(establishment);
        System.out.println("  ✓ 1 estabelecimento de exemplo inserido");
    }

    /**
     * Insere usuários de exemplo
     */
    private void insertSampleUsers() {
        MongoCollection<Document> usersCollection = database.getCollection("users");

        // Verifica se já existem usuários
        if (usersCollection.countDocuments() > 0) {
            System.out.println("  ℹ Usuários já existem no banco");
            return;
        }

        // Busca o ID do estabelecimento criado
        MongoCollection<Document> estabCollection = database.getCollection("establishments");
        Document establishment = estabCollection.find().first();

        if (establishment == null) {
            System.out.println("  ✗ Nenhum estabelecimento encontrado");
            return;
        }

        org.bson.types.ObjectId establishmentId = establishment.getObjectId("_id");

        // Usuário 1: Proprietário
        Document user1 = new Document()
                .append("name", "João Silva")
                .append("email", "joao.silva@demonextis.com.br")
                .append("password", org.mindrot.jbcrypt.BCrypt.hashpw("senha123", org.mindrot.jbcrypt.BCrypt.gensalt()))
                .append("phone", "(11) 94002-8922")
                .append("cpf", "123.456.789-00")
                .append("establishment_id", establishmentId)
                .append("role", "owner")
                .append("auth_provider", "email")
                .append("is_active", true)
                .append("created_at", new java.util.Date())
                .append("updated_at", new java.util.Date());

        // Usuário 2: Gerente
        Document user2 = new Document()
                .append("name", "Maria Santos")
                .append("email", "maria.santos@demonextis.com.br")
                .append("password", org.mindrot.jbcrypt.BCrypt.hashpw("senha123", org.mindrot.jbcrypt.BCrypt.gensalt()))
                .append("phone", "(11) 95000-0000")
                .append("cpf", "987.654.321-00")
                .append("establishment_id", establishmentId)
                .append("role", "manager")
                .append("auth_provider", "email")
                .append("is_active", true)
                .append("created_at", new java.util.Date())
                .append("updated_at", new java.util.Date());

        usersCollection.insertMany(java.util.Arrays.asList(user1, user2));
        System.out.println("  ✓ 2 usuários de exemplo inseridos");
        System.out.println("    - Email: joao.silva@demonextis.com.br | Senha: senha123");
        System.out.println("    - Email: maria.santos@demonextis.com.br | Senha: senha123");
    }
}

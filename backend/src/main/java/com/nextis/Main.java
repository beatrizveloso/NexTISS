package com.nextis;

import com.nextis.config.DatabaseInitializer;
import com.nextis.config.MongoDBConnection;

/**
 * Classe principal do projeto NexTIS
 */
public class Main {

    public static void main(String[] args) {
        System.out.println("═══════════════════════════════════════════");
        System.out.println("    NEXTIS - DATABASE INITIALIZATION");
        System.out.println("═══════════════════════════════════════════");

        try {
            MongoDBConnection.getInstance();

            DatabaseInitializer initializer = new DatabaseInitializer();
            initializer.initializeDatabase();

            showMenu();

        } catch (Exception e) {
            System.err.println("\n❌ ERRO: " + e.getMessage());
            e.printStackTrace();
        } finally {
            MongoDBConnection.getInstance().close();
        }
    }

    private static void showMenu() {
        System.out.println("═══════════════════════════════════════════");
        System.out.println("📚 PRÓXIMOS PASSOS:");
        System.out.println("═══════════════════════════════════════════");
        System.out.println();
        System.out.println("1. Abra o MongoDB Compass");
        System.out.println("   URL: mongodb://localhost:27017");
        System.out.println();
        System.out.println("2. Conecte ao banco 'nextis_db'");
        System.out.println();
        System.out.println("3. Explore as collections criadas:");
        System.out.println("   ➤ users (2 usuários)");
        System.out.println("   ➤ plans (3 planos)");
        System.out.println("   ➤ subscriptions");
        System.out.println("   ➤ establishments (1 estabelecimento)");
        System.out.println("   ➤ products (33 produtos eStock)");
        System.out.println("   ➤ menu_items (33 itens ComandOU)");
        System.out.println("   ➤ orders (2 pedidos)");
        System.out.println("   ➤ suppliers (5 fornecedores)");
        System.out.println("   ➤ stock_movements (movimentações)");
        System.out.println("   ➤ sales (vendas)");
        System.out.println("   ➤ system_settings (configurações)");
        System.out.println();
        System.out.println("4. Teste login com usuário de exemplo:");
        System.out.println("   Email: joao.silva@demonextis.com.br");
        System.out.println("   Senha: senha123");
        System.out.println("   Cargo: Administrador");
        System.out.println();
        System.out.println("5. Execute os exemplos de operações:");
        System.out.println("   ➤ ComandOUOperations.java - Sistema de Comandas");
        System.out.println("   ➤ EStockOperations.java - Sistema de Estoque");
        System.out.println();
        System.out.println("═══════════════════════════════════════════");
        System.out.println("🍷 SISTEMA COMANDOU:");
        System.out.println("═══════════════════════════════════════════");
        System.out.println();
        System.out.println("✅ 33 produtos cadastrados no cardápio");
        System.out.println("✅ 8 categorias organizadas");
        System.out.println("✅ Sistema de preços (dose/garrafa/simples)");
        System.out.println("✅ Alertas de estoque baixo");
        System.out.println("✅ Gerenciamento de pedidos");
        System.out.println("✅ Cálculo automático de totais");
        System.out.println();
        System.out.println("📊 PRODUTOS POR CATEGORIA:");
        System.out.println("   🍷 Vinhos: 1");
        System.out.println("   🥃 Destilados: 6");
        System.out.println("   🍾 Licores: 1");
        System.out.println("   🍾 Espumantes: 1");
        System.out.println("   🍺 Cervejas: 3");
        System.out.println("   🍺 Chopp: 1");
        System.out.println("   💧 Águas: 2");
        System.out.println("   🥜 Petiscos: 6");
        System.out.println("   🍟 Porções: 8");
        System.out.println();
        System.out.println("⚠️  ALERTAS COMANDOU:");
        System.out.println("   🔴 Rum Explorer Trinidad: 5 unidades");
        System.out.println("   🔴 Licor Sheridans: 4 unidades");
        System.out.println("   🔴 Conhaque Hennessy: 2 unidades");
        System.out.println();
        System.out.println("═══════════════════════════════════════════");
        System.out.println("📦 SISTEMA ESTOCK:");
        System.out.println("═══════════════════════════════════════════");
        System.out.println();
        System.out.println("✅ 33 produtos cadastrados no estoque");
        System.out.println("✅ 5 fornecedores ativos");
        System.out.println("✅ Sistema de shots calculados");
        System.out.println("✅ Controle de validade");
        System.out.println("✅ Movimentações registradas");
        System.out.println("✅ Relatórios de vendas");
        System.out.println("✅ Dashboard completo");
        System.out.println();
        System.out.println("📈 ESTATÍSTICAS ESTOCK:");
        System.out.println("   Total de Produtos: 33");
        System.out.println("   Total de Shots: 1434");
        System.out.println("   Fornecedores: 5");
        System.out.println("   Alertas de Estoque: 3");
        System.out.println();
        System.out.println("👥 FORNECEDORES:");
        System.out.println("   • Distribuidora de Bebidas LTDA");
        System.out.println("   • Importadora de Vinhos");
        System.out.println("   • Cervejaria Nacional");
        System.out.println("   • Águas Puras");
        System.out.println("   • Petiscos & Companhia");
        System.out.println();
        System.out.println("═══════════════════════════════════════════");
    }
}
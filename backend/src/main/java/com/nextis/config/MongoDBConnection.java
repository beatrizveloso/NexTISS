package com.nextis.config;

import com.mongodb.ConnectionString;
import com.mongodb.MongoClientSettings;
import com.mongodb.ServerApi;
import com.mongodb.ServerApiVersion;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoDatabase;
import org.bson.codecs.configuration.CodecRegistry;
import org.bson.codecs.pojo.PojoCodecProvider;

import static org.bson.codecs.configuration.CodecRegistries.fromProviders;
import static org.bson.codecs.configuration.CodecRegistries.fromRegistries;

/**
 * Classe responsável pela conexão com o MongoDB
 */
public class MongoDBConnection {

    private static MongoDBConnection instance;
    private MongoClient mongoClient;
    private static final String DATABASE_NAME = "nextis_db";
    private static final String CONNECTION_STRING = "mongodb://localhost:27017";

    private MongoDBConnection() {
        try {
            CodecRegistry pojoCodecRegistry = fromProviders(
                    PojoCodecProvider.builder().automatic(true).build()
            );

            CodecRegistry codecRegistry = fromRegistries(
                    MongoClientSettings.getDefaultCodecRegistry(),
                    pojoCodecRegistry
            );

            MongoClientSettings settings = MongoClientSettings.builder()
                    .applyConnectionString(new ConnectionString(CONNECTION_STRING))
                    .serverApi(ServerApi.builder()
                            .version(ServerApiVersion.V1)
                            .build())
                    .codecRegistry(codecRegistry)
                    .build();

            mongoClient = MongoClients.create(settings);

            mongoClient.getDatabase(DATABASE_NAME)
                    .runCommand(new org.bson.Document("ping", 1));

            System.out.println("✅ Conectado ao MongoDB com sucesso!");

        } catch (Exception e) {
            System.err.println("❌ Erro ao conectar ao MongoDB: " + e.getMessage());
            throw new RuntimeException("Falha na conexão com MongoDB", e);
        }
    }

    public static MongoDBConnection getInstance() {
        if (instance == null) {
            synchronized (MongoDBConnection.class) {
                if (instance == null) {
                    instance = new MongoDBConnection();
                }
            }
        }
        return instance;
    }

    public MongoDatabase getDatabase() {
        return mongoClient.getDatabase(DATABASE_NAME);
    }

    public void close() {
        if (mongoClient != null) {
            mongoClient.close();
            System.out.println("🔒 Conexão com MongoDB fechada.");
        }
    }
}
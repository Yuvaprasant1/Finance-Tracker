package com.finance.tracker.user.changelog;

import io.mongock.api.annotations.ChangeUnit;
import io.mongock.api.annotations.Execution;
import io.mongock.api.annotations.RollbackExecution;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.index.Index;
import org.springframework.data.mongodb.core.index.IndexOperations;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.index.MongoPersistentEntityIndexResolver;
import org.springframework.data.mongodb.core.mapping.MongoMappingContext;

@ChangeUnit(id = "user-email-index-migration", order = "002", author = "finance-tracker")
public class UserAuthMigrationChangelog {

    private static final String COLLECTION = "users";

    @Execution
    public void execution(MongoTemplate mongoTemplate, MongoMappingContext mappingContext) {
        IndexOperations indexOps = mongoTemplate.indexOps(COLLECTION);

        // Ensure unique index on email
        indexOps.ensureIndex(new Index().on("email", org.springframework.data.domain.Sort.Direction.ASC).unique());

        // Drop unique index on phoneNumber if exists (index name may vary, try common names)
        tryDropIndex(indexOps, "phoneNumber_1");
        tryDropIndex(indexOps, "phoneNumber_1_unique");
    }

    private void tryDropIndex(IndexOperations indexOps, String name) {
        try {
            indexOps.dropIndex(name);
        } catch (Exception ignored) {
        }
    }

    @RollbackExecution
    public void rollback(MongoTemplate mongoTemplate) {
        // No rollback: indexes can be recreated by Spring Data if needed
    }
}



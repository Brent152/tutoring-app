// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { relations, sql } from "drizzle-orm";
import {
  boolean,
  integer,
  pgTable,
  pgTableCreator,
  serial,
  timestamp,
  varchar
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `tutoring-app_${name}`);

export const users = pgTable('users', {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 256 }),
  email: varchar("email", { length: 256 }),
  firstName: varchar("first_name", { length: 256 }),
  lastName: varchar("last_name", { length: 256 }),

  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at"),
});

export const questionSets = pgTable('question_sets', {
  id: serial("id").primaryKey(),
  description: varchar("description", { length: 2048 }),
  subject: varchar("subject", { length: 256 }),
  title: varchar("title", { length: 256 }),

  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at"),
});

export const questionSetRelations = relations(questionSets, ({ many }) => ({
  questions: many(questions),
}));

export const questions = pgTable('questions', {
  id: serial("id").primaryKey(),
  questionSetId: integer("question_set_id").references(() => questionSets.id).notNull(),
  text: varchar("text", { length: 256 }),

  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at"),
});

export const questionsRelations = relations(questions, ({ many, one }) => ({
  questionSet: one(questionSets, {
    fields: [questions.questionSetId],
    references: [questionSets.id],
  }),
  answers: many(answers),
}));

export const answers = pgTable('answers', {
  id: serial("id").primaryKey(),
  questionId: integer("question_id").references(() => questions.id).notNull(),
  text: varchar("text", { length: 256 }),
  correct: boolean('correct').notNull(),

  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at"),
});

export const answersRelations = relations(answers, ({ one }) => ({
  question: one(questions, {
    fields: [answers.questionId],
    references: [questions.id],
  })
}));

export const messageLogs = pgTable('messageLogs', {
  id: serial("id").primaryKey(),
  questionSetId: integer("question_set_id"),
  text: varchar("text", { length: 10000 }),

  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at"),
});


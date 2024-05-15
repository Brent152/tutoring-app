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
  username: varchar("username", { length: 256 }).notNull(),
  email: varchar("email", { length: 256 }).notNull(),
  firstName: varchar("first_name", { length: 256 }).notNull(),
  lastName: varchar("last_name", { length: 256 }).notNull(),

  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at"),
});

export const userRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
}));

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
  sessions: many(sessions),
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

export const questionRelations = relations(questions, ({ many, one }) => ({
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

export const answerRelations = relations(answers, ({ one }) => ({
  question: one(questions, {
    fields: [answers.questionId],
    references: [questions.id],
  })
}));

export const sessions = pgTable('sessions', {
  id: serial("id").primaryKey(),
  questionSetId: integer("question_set_id").references(() => questionSets.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),

  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at"),
});

export const sessionRelations = relations(sessions, ({ many, one }) => ({
  questionSet: one(questionSets, {
    fields: [sessions.questionSetId],
    references: [questionSets.id],
  }),
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
  sessionAnswers: many(sessionAnswers),
}));

export const sessionAnswers = pgTable('session_answers', {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  sessionId: integer("session_id").references(() => sessions.id).notNull(),
  questionId: integer("question_id").references(() => questions.id).notNull(),
  selectedAnswerId: integer("selected_answer_id").references(() => answers.id),

  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at"),
});

export const sessionAnswerRelations = relations(sessionAnswers, ({ one }) => ({
  session: one(sessions, {
    fields: [sessionAnswers.sessionId],
    references: [sessions.id],
  }),
  user: one(users, {
    fields: [sessionAnswers.userId],
    references: [users.id],
  }),
  question: one(questions, {
    fields: [sessionAnswers.questionId],
    references: [questions.id],
  }),
  selectedAnswer: one(answers, {
    fields: [sessionAnswers.selectedAnswerId],
    references: [answers.id],
  }),
}));

export const sessionMessages = pgTable('session_messages', {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  sessionId: integer("session_id").references(() => sessions.id).notNull(),
  currentQuestionId: integer("current_question_id").references(() => questions.id).notNull(),
  text: varchar("text", { length: 16000 }),
  senderTypeId: integer("sender_type_id").notNull(),

  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at"),
});

export const messageRelations = relations(sessionMessages, ({ many, one }) => ({
  session: one(sessions, {
    fields: [sessionMessages.sessionId],
    references: [sessions.id],
  }),
  user: one(users, {
    fields: [sessionMessages.userId],
    references: [users.id],
  }),
  question: one(questions, {
    fields: [sessionMessages.currentQuestionId],
    references: [questions.id],
  }),
}));
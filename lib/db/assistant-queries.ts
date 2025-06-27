import 'server-only';
import { eq, desc, isNull, and } from 'drizzle-orm';

import { assistant, type NewAssistant } from './schema';
import { withDbErrorLogging } from './utils';
import { db } from './client';

export async function getAssistantsByUserId(userId: string) {
  return withDbErrorLogging(async function getAssistantsByUserId() {
    return db
      .select()
      .from(assistant)
      .where(and(eq(assistant.userId, userId), isNull(assistant.deletedAt)))
      .orderBy(desc(assistant.createdAt));
  });
}

export async function createAssistant(newAssistant: NewAssistant) {
  return withDbErrorLogging(async function createAssistant() {
    const [result] = await db
      .insert(assistant)
      .values(newAssistant)
      .returning();
    return result;
  });
}

export async function softDeleteAssistant(assistantId: string, userId: string) {
  return withDbErrorLogging(async function softDeleteAssistant() {
    const [result] = await db
      .update(assistant)
      .set({
        deletedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(assistant.id, assistantId),
          eq(assistant.userId, userId),
          isNull(assistant.deletedAt),
        ),
      )
      .returning();
    return result;
  });
}

export async function updateAssistant(
  assistantId: string,
  userId: string,
  data: Partial<{
    name: string;
    instructions: string;
    avatar: string;
  }>,
) {
  return withDbErrorLogging(async function updateAssistant() {
    const [result] = await db
      .update(assistant)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(assistant.id, assistantId),
          eq(assistant.userId, userId),
          isNull(assistant.deletedAt),
        ),
      )
      .returning();
    return result;
  });
}

export async function getAssistantById(assistantId: string) {
  return withDbErrorLogging(async function getAssistantById() {
    const [result] = await db
      .select()
      .from(assistant)
      .where(and(eq(assistant.id, assistantId), isNull(assistant.deletedAt)));
    return result;
  });
}

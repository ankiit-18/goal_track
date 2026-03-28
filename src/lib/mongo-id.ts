/** Prisma MongoDB @db.ObjectId string is 24 hex chars */
export function isMongoObjectIdString(id: string): boolean {
  return /^[0-9a-fA-F]{24}$/.test(id);
}

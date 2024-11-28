import { Repository } from 'typeorm';

export function generateAlphanumericId(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function generateUniqueAlphanumericId(
  repository: Repository<any>,
  field: string,
  initialLength = 6,
): Promise<string> {
  let length = initialLength;
  let isUnique = false;
  let id: string;

  while (!isUnique) {
    id = generateAlphanumericId(length);
    const existing = await repository.findOne({ where: { [field]: id } });
    if (!existing) {
      isUnique = true;
    } else {
      length++;
    }
  }

  return id;
}

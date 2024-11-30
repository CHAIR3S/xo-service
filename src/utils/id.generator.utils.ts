import { Ticket } from 'src/ticket/entities/ticket.entity';
import { Repository } from 'typeorm';


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


export function generateAlphanumericId(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'; // Conjunto de caracteres
  let result = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    result += chars.charAt(randomIndex); // Generar un carácter aleatorio
  }

  return result;
}

export async function generateUniqueLengthCodeForEvent(
  eventId: string,
  ticketRepository: Repository<Ticket>,
  length = 6, // Longitud exacta del código
): Promise<string> {
  let isUnique = false;
  let code: string;

  while (!isUnique) {
    code = generateAlphanumericId(length); // Generar un código alfanumérico fijo
    const existingTicket = await ticketRepository.findOne({
      where: { event: { id: eventId }, code }, // Verificar unicidad en el evento
    });

    if (!existingTicket) {
      isUnique = true; // Es único, salir del bucle
    }
  }

  return code; 
}
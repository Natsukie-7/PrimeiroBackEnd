import { endOfDay, startOfDay } from "date-fns";
import { prisma } from "../database/prisma";
import { ICreate } from "../interfaces/SchedulesInterface";

export class SchedulesRepository {
    async create({ name, phone, date }: ICreate) {
        const result = await prisma.schedule.create({
            data: {
                name,
                phone,
                date,
            },
        });
        return result;
    }

    async find(date: Date) {
        const result = await prisma.schedule.findFirst({
            where: { date },
        });
        return result;
    }

    async findAll(date: Date) {
        const result = await prisma.schedule.findMany({
            where: {
                date: {
                    gte: startOfDay(date),
                    lt: endOfDay(date),
                },
            },
            orderBy: {
                date: 'asc',
            },
        });
        return result;
    }
}
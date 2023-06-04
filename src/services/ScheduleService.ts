import { ICreate } from "../interfaces/SchedulesInterface";
import { isBefore, startOfHour } from "date-fns"
import { SchedulesRepository } from "../repositories/ServiceRepository";

export class ScheduleService {
    private scheduleRepository: SchedulesRepository
    constructor() {
        this.scheduleRepository = new SchedulesRepository()
    }

    async create({ name, phone, date }: ICreate) {
        const dateFormatted = new Date(date)
        const hourStart = startOfHour(dateFormatted);
        
        
        if (isBefore(hourStart, new Date())){
            throw new Error('Data inatingivel!.... volte no tempo antes de tentar essa data novamente!....')
        }
        
        const checkIsAvaible = await this.scheduleRepository.find(hourStart)
        if (checkIsAvaible) {
            throw new Error("Data não disponivel!...")
        }
        const create = await this.scheduleRepository.create({
            name,
            phone,
            date: hourStart
        })
        return create
    };
}
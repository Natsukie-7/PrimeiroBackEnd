import { ICreate } from "../interfaces/SchedulesInterface";
import { isBefore, startOfHour } from "date-fns"
import { SchedulesRepository } from "../repositories/ServiceRepository";

export class SchedulesService {
    private schedulesRepository: SchedulesRepository;
    constructor() {
        this.schedulesRepository = new SchedulesRepository()
    }

    async create({ name, phone, date }: ICreate) {
        const dateFormatted = new Date(date)
        const hourStart = startOfHour(dateFormatted);
        
        
        if (isBefore(hourStart, new Date())){
            throw new Error('Data inatingivel!.... volte no tempo antes de tentar essa data novamente!....')
        }
        
        const checkIsAvaible = await this.schedulesRepository.find(hourStart)
        if (checkIsAvaible) {
            throw new Error("Data não disponivel!...")
        }
        const create = await this.schedulesRepository.create({
            name,
            phone,
            date: hourStart
        })
        return create
    };
    async index(date: Date) {
        const result = await this.schedulesRepository.findAll(date);
        console.log(result)

        return result;
    }

    async update() {

    }
}
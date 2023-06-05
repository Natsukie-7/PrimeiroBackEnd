import { NextFunction, Request, Response } from "express";
import { SchedulesService } from "../services/ScheduleService";
import { parseISO } from "date-fns";

class SchedulesController {
    private scheduleService: SchedulesService;
    
    constructor() {
        this.scheduleService = new SchedulesService()
    }

    async store(request: Request, response: Response, next: NextFunction) {
        const { name, phone, date } = request.body;
        try {
            const result = await this.scheduleService.create({ name, phone, date,})

            return response.status(201).json(result)
        } catch (error) {
            next(error)
        }
    }

    async index(request: Request, response: Response, next: NextFunction) {
        const { date } = request.query;
        const parseDate = date ? parseISO(date.toString()) : new Date();
        try {
            const result = await this.scheduleService.index(parseDate);
            return response.json(result);
        } catch (error) {
            next(error);
        }
    }
    
    async update(request: Request, response: Response, next: NextFunction) {
        try {
            const result = await this.scheduleService.update()
            return response.json(result)

        } catch (error) {
            next(error)
        }
     }
    delete(request: Request, response: Response, next: NextFunction) { }

}

export { SchedulesController }
import { NextFunction, Request, Response } from "express";
import { ScheduleService } from "../services/ScheduleService";

class ScheduleController {
    private scheduleService: ScheduleService;

    constructor() {
        this.scheduleService = new ScheduleService()
    }

    async store(request: Request, response: Response, next: NextFunction) {
        const { name, phone, date } = request.body;
        try {
            const result = await this.scheduleService.create({ name, phone, date })

            return response.status(201).json(response)
        } catch (error) {
            next(error)
        }
    }
}

export { ScheduleController }
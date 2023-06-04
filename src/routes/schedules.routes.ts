import { Router } from "express";
import { ScheduleController } from "../controllers/ScheduleController";

class SchedulesRoutes {
    private router: Router;
    private schedulesController: ScheduleController;
    constructor() {
        this.router = Router();
        this.schedulesController = new ScheduleController()
    }
    getRoutes(): Router {
        this.router.post('/',
        this.schedulesController.store.bind(this.schedulesController));
        return this.router;
    }
}

export { SchedulesRoutes }
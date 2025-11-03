import { Router } from "express";
import {
    addEmployee,
    getAllEmployees,
    getEmployeeById,
    healthCheck,
    patchEmployeeById,
    removeEmployeeById,
    updateEmployeeById
} from "./controllers.js";
import { validate } from "./middleware.js";

const employeeRouter = Router();

employeeRouter.get('/health', healthCheck);
employeeRouter.get('/employees', getAllEmployees);
employeeRouter.get('/employees/:id', validate("id"), getEmployeeById);
employeeRouter.post('/employees', validate("body"), addEmployee);
employeeRouter.put('/employees/:id', validate("id", "body"), updateEmployeeById);
employeeRouter.delete('/employees/:id', validate("id"), removeEmployeeById);
employeeRouter.patch('/employees/:id', patchEmployeeById);

export { employeeRouter };
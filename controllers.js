import e from "express";
import { conn } from "./db.js";

const healthCheck = (req, res) => {
    conn.query('select 1', (err, rows) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ msg: "Internal Server Error" });
        }
        else return res.json(rows[0]);
    })
}

const getAllEmployees = (_, res) => {
    let query = 'select * from employees';
    conn.query(query, (err, rows) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ msg: "Internal Server Error" });
        }
        return res.status(200).json(rows);
    })
}

const getEmployeeById = (req, res) => {
    const id = res.locals.id;
    let query = 'select * from employees where id=?';
    let vals = [id];
    conn.query(query, vals, (err, rows) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ msg: "Internal Server Error" });
        }
        console.log(rows);
        if (rows[0]) {
            return res.json(rows[0]);
        }
        return res.status(200).json({ msg: `No Entries found for id ${id}` });
    })
}

const addEmployee = (req, res) => {
    let { name, designation, yoe, salary } = res.locals;
    let query = 'insert into employees(name, designation, yoe, salary) values (?, ?, ?, ?)';
    let vals = [name, designation, yoe, salary];
    conn.query(query, vals, (err, rows) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ msg: "Internal Server Error" });
        }
        console.log(rows.affectedRows);
        let id = rows.insertId;
        if (rows.affectedRows === 1) {
            conn.query('select * from employees where id=?', [id], (err2, rows2) => {
                if (err2) {
                    console.log(err2);
                    return res.status(500).json({ msg: "Internal Server Error" });
                }
                return res.status(201).json({ msg: `Employee added successfully!`, employee: rows2[0] })
            })
        } else {
            return res.status(500).json({ msg: "Employee not added!" });
        }
    });
}

const updateEmployeeById = (req, res) => {
    let { id, name, designation, yoe, salary } = res.locals;
    let query = 'update employees set name=?, designation=?, yoe=?, salary=? where id=?';
    let vals = [name, designation, yoe, salary, id];
    conn.query(query, vals, (err, rows) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ msg: "Internal Server Error" });
        }
        if (rows.affectedRows === 1) {
            conn.query('select * from employees where id=?', [id], (err2, rows2) => {
                if (err2) {
                    console.log(err2);
                    return res.status(500).json({ msg: "Internal Server Error" });
                }
                return res.status(200).json({ msg: `Employee updated successfully!`, employee: rows2[0] })
            })
        } else {
            return res.status(404).json({ msg: `Employee with id ${id} not found!` });
        }
    })
}

const removeEmployeeById = (req, res) => {
    const id = res.locals.id;
    let query = 'delete from employees where id=?';
    let vals = [id];
    conn.query(query, vals, (err, rows) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ msg: "Internal Server Error" });
        }
        if (rows.affectedRows === 1) {
            return res.status(200).json({ msg: `Employee with id ${id} deleted!` });
        }
        return res.status(404).json({ msg: `Employee with id ${id} not found!` });
    })
}

const patchEmployeeById = (req, res) => {
    const id = parseInt(req.params.id);
    let { name, designation, yoe = null, salary = null } = req.body;
    yoe = parseInt(yoe);
    salary = parseInt(salary);
    if (!name && !designation && (isNaN(yoe) || yoe == null) && (isNaN(salary) || salary == null)) {
        return res.status(400).json({ msg: "Nothing to update", possibleFields: ["name", "designation", "yoe", "salary"] });
    }
    yoe = parseInt(yoe);
    salary = parseInt(salary);
    let currErrors = {}
    let updatedVals = []
    let query = 'update employees set ';
    let vals = [];
    if (isNaN(id)) {
        currErrors.id = "Invalid id";
    }
    if (name) {
        let nameLen = name.length;
        if (nameLen > 100) {
            currErrors.name = "Name length should be less than 100 chars";
        } else {
            query += 'name=?, ';
            vals.push(name);
            updatedVals.push("name");
        }
    }
    if (designation) {
        let designationLen = designation.length;
        if (designationLen > 50) {
            currErrors.designation = "Designation length should be less than 50 chars";
        } else {
            query += 'designation=?, ';
            vals.push(designation);
            updatedVals.push("designation");
        }
    }
    if (yoe || yoe == 0) {
        if (isNaN(yoe)) {
            currErrors.yoe = "Invalid yoe";
        } else {
            query += 'yoe=?, ';
            vals.push(yoe);
            updatedVals.push("yoe");
        }
    }
    if (salary) {
        if (isNaN(salary)) {
            currErrors.salary = "Invalid salary";
        } else {
            query += 'salary=?, ';
            vals.push(salary);
            updatedVals.push("salary");
        }
    }
    if (Object.keys(currErrors).length !== 0) {
        return res.status(400).json({ errors: currErrors });
    }
    query = query.slice(0, -2);
    query += " where id=?";
    vals.push(id);
    console.log("query :", query, "\nvals :", vals);
    conn.query(query, vals, (err, rows) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ msg: "Internal Server Error" });
        }
        if (rows.affectedRows === 1) {
            conn.query('select * from employees where id=?', [id], (err2, rows2) => {
                if (err2) {
                    console.log(err2);
                    return res.status(500).json({ msg: "Internal Server Error" });
                }
                return res.status(200).json({ msg: `Employee updated successfully!`, updatedVals, employee: rows2[0] })
            })
        } else {
            return res.status(404).json({ msg: `Employee with id ${id} not found!` });
        }
    });
}

export {
    healthCheck,
    getAllEmployees,
    getEmployeeById,
    addEmployee,
    updateEmployeeById,
    removeEmployeeById,
    patchEmployeeById
};
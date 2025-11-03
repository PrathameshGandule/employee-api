const validate = (...vals) => {
    return (req, res, next) => {
        if (vals.includes("id")) {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({ msg: "Invalid id" });
            }
            res.locals.id = id;
        }
        if (vals.includes("body")) {
            let { name, designation, yoe, salary } = req.body;
            yoe = parseInt(yoe);
            salary = parseInt(salary);
            if (!name || !designation || yoe == null || salary == null) {
                return res.status(400).json({ msg: "Fill all fields!", required: ["name", "designation", "yoe", "salary"] });
            }
            let nameLen = name.length;
            let designationLen = designation.length;
            let currErrors = {}
            if (isNaN(yoe)) {
                currErrors.yoe = "Invalid yoe";
            }
            if (isNaN(salary)) {
                currErrors.salary = "Invalid salary";
            }
            if (nameLen > 100) {
                currErrors.name = "Name length should be less than 100 chars";
            }
            if (designationLen > 50) {
                currErrors.designation = "Designation length should be less than 50 chars";
            }
            if (Object.keys(currErrors).length !== 0) {
                return res.status(400).json({ errors: currErrors });
            }
            res.locals.name = name;
            res.locals.designation = designation;
            res.locals.yoe = yoe;
            res.locals.salary = salary;
        }
        next();
    }
}

export { validate };
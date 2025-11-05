const Joi = require("joi");

const bookingSchema = Joi.object({
  customer_name: Joi.string().min(2).max(100).required(),
  customer_email: Joi.string().email().required(),
  customer_phone: Joi.string().min(10).required(),
  room_id: Joi.number().integer().positive().required(),
  check_in_date: Joi.date().greater("now").required(),
  check_out_date: Joi.date().greater(Joi.ref("check_in_date")).required(),
  num_guests: Joi.number().integer().min(1).max(10).required(),
});

const roomSchema = Joi.object({
  room_number: Joi.string().max(10).required(),
  type: Joi.string().valid("single", "double", "suite").required(),
  floor: Joi.number().integer().min(1).required(),
  price_per_night: Joi.number().positive().required(),
  status: Joi.string()
    .valid("available", "occupied", "maintenance")
    .default("available"),
  description: Joi.string().allow(""),
});

const employeeSchema = Joi.object({
  full_name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  department: Joi.string()
    .valid("front desk", "housekeeping", "restaurant", "finance", "management")
    .required(),
  position: Joi.string().max(50).required(),
  salary: Joi.number().positive().required(),
  hire_date: Joi.date().required(),
  contact_number: Joi.string().min(10).required(),
  address: Joi.string().allow(""),
});

const housekeepingSchema = Joi.object({
  room_id: Joi.number().integer().positive().required(),
  assigned_to: Joi.number().integer().positive().required(),
  task_description: Joi.string().min(5).required(),
  status: Joi.string()
    .valid("pending", "in_progress", "completed")
    .default("pending"),
});

const validate = (schema: any) => {
  return (req: any, res: any, next: any) => {
    const { error } = schema.validate(req.body);
    if (error) {
      res.status(400).json({ error: error.details[0].message });
      return;
    }
    next();
  };
};

module.exports = {
  validateBooking: validate(bookingSchema),
  validateRoom: validate(roomSchema),
  validateEmployee: validate(employeeSchema),
  validateHousekeeping: validate(housekeepingSchema),
};

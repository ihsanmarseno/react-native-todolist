import { z } from "zod";

const addTaskSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  description: z
    .string()
    .min(3, { message: "Description must be at least 3 characters" }),
  due_date: z
    .string()
    .min(1, { message: "Due date must be at least 1 character" }),
});

type AddTaskSchema = z.infer<typeof addTaskSchema>;

export { addTaskSchema, AddTaskSchema };

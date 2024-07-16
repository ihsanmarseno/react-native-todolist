export type Task = {
  task_id: string;
  title: string;
  description: string;
  due_date: string;
  status: string;
  created_at: string;
  updated_at: string;
};

export type TaskList = {
  data: Task[];
};

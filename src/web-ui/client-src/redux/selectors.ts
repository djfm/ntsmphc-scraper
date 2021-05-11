export const getAllNotifications = (store: any) => store.notifications;

export const getAllProjects = (store: any) => store.projects;

export const getProjectById = (id: number) => (store: any) => {
  const projects = store.projects as any[];
  return projects.find((project) => project.id === id);
};

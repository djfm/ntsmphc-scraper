import React from 'react';

import {
  useSelector,
} from 'react-redux';

import {
  useParams as useRouterParams,
} from 'react-router-dom';

import {
  getProjectById,
} from '../redux/selectors';

const OneScrapingProject = () => {
  const routerParams = useRouterParams() as any;
  const id: number = parseFloat(routerParams.id);
  const project = useSelector(getProjectById(id));

  const createdDate = new Date(project.createdAt);

  if (project === undefined) {
    return (
      <main>
        <h1>Scraping project #{id}</h1>
        <p>This project doesn&apos;t seem to exist!</p>
      </main>
    );
  }

  return (
    <main>
      <h1>Scraping Project: &quot;{project.projectName}&quot; (#{id})</h1>
      <p>
        <strong>Here is some basic info about this project</strong>:
        <dl>
          <dt>Start URL:</dt>
          <dd>{project.startURL}</dd>
          <dt>Creation date:</dt>
          <dd>{createdDate.toLocaleDateString()} {createdDate.toLocaleTimeString()}</dd>
        </dl>
      </p>
    </main>
  );
};

export default OneScrapingProject;

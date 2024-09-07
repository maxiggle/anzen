import React from 'react';
import { KintoConnect } from './KintoConnect';
import ProjectBudget from './ProjectBudget';

const ProjectBudgetPage = () => {
  return (
    <KintoConnect>
    {(isAuthenticated) => isAuthenticated ? <ProjectBudget /> : null}
  </KintoConnect>
  );
};

export default ProjectBudgetPage;
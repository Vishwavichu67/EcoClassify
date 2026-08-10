import React from 'react';
import { PlatformGuide } from './PlatformGuide';

interface ProjectReportViewerProps {
  onNavigateToTab?: (tab: string) => void;
}

export const ProjectReportViewer: React.FC<ProjectReportViewerProps> = ({ onNavigateToTab }) => {
  return <PlatformGuide onNavigateToTab={onNavigateToTab} />;
};


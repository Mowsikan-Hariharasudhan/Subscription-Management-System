import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  breadcrumbs,
  actions,
}) => {
  const activeBreadcrumbs = breadcrumbs && breadcrumbs.length > 0 ? breadcrumbs : [
    { label: 'Home', href: '/dashboard' },
    { label: title },
  ];

  return (
    <div className="mb-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3 pb-3">
      <div>
        <nav className="flex items-center space-x-1.5 text-xs text-text-secondary mb-1">
          {activeBreadcrumbs.map((item, index) => (
            <React.Fragment key={index}>
              {index > 0 && <span className="text-text-muted">/</span>}
              {item.href ? (
                <Link to={item.href} className="hover:text-plum-primary transition-colors">
                  {item.label}
                </Link>
              ) : (
                <span className="font-semibold text-text-primary">{item.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>
        <h1 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight">
          {title}
        </h1>
        {description && <p className="text-xs sm:text-sm text-text-secondary mt-0.5">{description}</p>}
      </div>

      {actions && <div className="flex items-center gap-2.5 flex-wrap shrink-0">{actions}</div>}
    </div>
  );
};

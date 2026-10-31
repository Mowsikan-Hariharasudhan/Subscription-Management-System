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
  return (
    <div className="mb-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3 pb-4 border-b border-border-main">
      <div>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex items-center space-x-1 text-[11px] text-text-secondary mb-1">
            {breadcrumbs.map((item, index) => (
              <React.Fragment key={index}>
                {index > 0 && <ChevronRight className="w-3 h-3 text-border-main shrink-0" />}
                {item.href ? (
                  <Link to={item.href} className="hover:text-plum-primary transition-colors">
                    {item.label}
                  </Link>
                ) : (
                  <span className="font-medium text-text-primary">{item.label}</span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}
        <h1 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight font-sans">
          {title}
        </h1>
        {description && <p className="text-xs sm:text-sm text-text-secondary mt-0.5">{description}</p>}
      </div>

      {actions && <div className="flex items-center gap-2 flex-wrap shrink-0">{actions}</div>}
    </div>
  );
};

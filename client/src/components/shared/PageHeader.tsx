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
    <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b-[1.5px] border-black/10 anim-spring stagger-1">
      <div>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex items-center space-x-2 text-[0.6875rem] font-bold text-gray-500 uppercase tracking-wider mb-2">
            {breadcrumbs.map((item, index) => (
              <React.Fragment key={index}>
                {index > 0 && <ChevronRight className="w-3.5 h-3.5 text-gray-400" />}
                {item.href ? (
                  <Link to={item.href} className="hover:text-odoo transition-colors">
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-odoo-dark font-extrabold">{item.label}</span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}
        <h1 className="text-[2rem] font-bold text-odoo-dark tracking-tight leading-tight">
          {title}
        </h1>
        {description && (
          <p className="text-[0.9375rem] text-gray-600 font-medium mt-1">
            {description}
          </p>
        )}
      </div>

      {actions && (
        <div className="flex items-center gap-3 flex-wrap">
          {actions}
        </div>
      )}
    </div>
  );
};

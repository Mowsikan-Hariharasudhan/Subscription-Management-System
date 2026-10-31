import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Plus, FileText, ChevronRight } from 'lucide-react';
import { PageHeader } from '../../components/shared/PageHeader';
import { EmptyState } from '../../components/shared/EmptyState';
import { LoadingSkeleton } from '../../components/shared/LoadingSkeleton';
import { CurrencyDisplay } from '../../components/shared/CurrencyDisplay';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent } from '../../components/ui/card';
import { api } from '../../services/api';

const templateService = {
  list: async () => {
    const res = await api.get('/quotation-templates');
    return res.data.data;
  },
  create: async (data: any) => {
    const res = await api.post('/quotation-templates', data);
    return res.data.data;
  },
};

export const QuotationTemplates: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: templates, isLoading } = useQuery({
    queryKey: ['quotation-templates'],
    queryFn: templateService.list,
  });

  if (isLoading) return <LoadingSkeleton count={4} />;

  return (
    <div className="space-y-4">
      <PageHeader
        title="Quotation Templates"
        description="Pre-configured quotation blueprints for common subscription packages"
        actions={
          <Button size="sm" onClick={() => navigate('/quotations')}>
            <Plus className="w-4 h-4 mr-1" /> New Quotation
          </Button>
        }
      />

      {!templates || templates.length === 0 ? (
        <EmptyState
          title="No quotation templates"
          description="Templates help staff quickly generate standard quotations for customers."
          icon={<FileText className="w-8 h-8" />}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {templates.map((tmpl: any) => (
            <Card key={tmpl.id} className={`hover:border-plum-primary/40 transition-colors cursor-pointer ${!tmpl.isActive ? 'opacity-60' : ''}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-lg bg-plum-light text-plum-primary flex items-center justify-center">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-text-primary">{tmpl.name}</p>
                      <p className="text-xs text-text-secondary">Valid {tmpl.validityDays} days</p>
                    </div>
                  </div>
                  <Badge variant={tmpl.isActive ? 'success' : 'secondary'}>
                    {tmpl.isActive ? 'ACTIVE' : 'DRAFT'}
                  </Badge>
                </div>

                {tmpl.plan && (
                  <div className="text-xs text-text-secondary mb-2">
                    Plan: <span className="font-medium text-text-primary">{tmpl.plan.name}</span>
                    <span className="ml-1 uppercase text-plum-muted">({tmpl.plan.billingFrequency})</span>
                  </div>
                )}

                <div className="text-xs text-text-secondary mb-3">
                  {tmpl.lines?.length || 0} product line(s)
                </div>

                {tmpl.lines && tmpl.lines.length > 0 && (
                  <div className="space-y-1 border-t border-border-main/40 pt-2">
                    {tmpl.lines.slice(0, 3).map((line: any) => (
                      <div key={line.id} className="flex justify-between items-center text-xs">
                        <span className="text-text-secondary truncate">{line.product?.name}</span>
                        <CurrencyDisplay amount={line.unitPrice} size="sm" className="text-text-primary font-medium" />
                      </div>
                    ))}
                    {tmpl.lines.length > 3 && (
                      <p className="text-xs text-text-secondary">+{tmpl.lines.length - 3} more lines</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

import { TaskItem } from './task-item.model';

export type LeadStatus = 'New' | 'Qualified' | 'Won' | 'Lost';

export interface Lead {
  id: string;
  name: string;
  email: string;
  status: LeadStatus;
  createdAt: string;
  updatedAt: string;
  tasks: TaskItem[];
}

export interface LeadCreateDto {
  name: string;
  email: string;
  status: LeadStatus;
}

export interface LeadUpdateDto {
  name: string;
  email: string;
  status: LeadStatus;
}

export const LEAD_STATUSES: LeadStatus[] = ['New', 'Qualified', 'Won', 'Lost'];

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  New: 'New',
  Qualified: 'Qualified',
  Won: 'Won',
  Lost: 'Lost'
};

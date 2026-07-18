import type { ITicketRepository } from '../../repositories/interfaces/ticket.repository.interface.js';
import { BaseService } from '../base/base.service.js';
import type { DashboardStatistics } from '../types/dashboard.service.types.js';

export class DashboardStatisticsService extends BaseService {
  constructor(private readonly ticketRepository: ITicketRepository) {
    super();
  }

  async getStatistics(): Promise<DashboardStatistics> {
    return this.ticketRepository.aggregateStatusCounts();
  }
}

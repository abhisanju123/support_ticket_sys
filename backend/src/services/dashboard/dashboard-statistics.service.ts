import { getTicketListScope } from '../../authorization/ticket-access.js';
import type { ITicketRepository } from '../../repositories/interfaces/ticket.repository.interface.js';
import type { AuthenticatedUser } from '../../types/auth.types.js';
import { BaseService } from '../base/base.service.js';
import type { DashboardStatistics } from '../types/dashboard.service.types.js';

export class DashboardStatisticsService extends BaseService {
  constructor(private readonly ticketRepository: ITicketRepository) {
    super();
  }

  async getStatistics(user: AuthenticatedUser): Promise<DashboardStatistics> {
    const { accessibleToUserId } = getTicketListScope(user);

    return this.ticketRepository.aggregateStatusCounts(accessibleToUserId);
  }
}

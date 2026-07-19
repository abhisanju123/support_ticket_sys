import { getTicketListScope } from '../../authorization/ticket-access.js';
import { TICKET_STATUSES } from '../../enums/ticket-status.enum.js';
import { buildTicketKeywordOrClauses } from '../../helpers/ticket-keyword-search.helper.js';
import type { ITicketPopulated } from '../../repositories/types/ticket.repository.types.js';
import type { ITicketRepository } from '../../repositories/interfaces/ticket.repository.interface.js';
import type { IUserRepository } from '../../repositories/interfaces/user.repository.interface.js';
import { ValidationException } from '../../exceptions/index.js';
import type { AuthenticatedUser } from '../../types/auth.types.js';
import { BaseService } from '../base/base.service.js';
import type { TicketFilterQuery, TicketListFilterQuery, TicketSearchQuery } from '../types/dashboard.service.types.js';

const DEFAULT_SORT = { ticketNumber: 1 } as const;

export class TicketSearchFilterService extends BaseService {
  constructor(
    private readonly ticketRepository: ITicketRepository,
    private readonly userRepository: IUserRepository,
  ) {
    super();
  }

  async searchByKeyword(
    query: TicketSearchQuery,
    user: AuthenticatedUser,
  ): Promise<ITicketPopulated[]> {
    const keyword = query.keyword?.trim();

    if (!keyword) {
      throw new ValidationException('Search keyword is required');
    }

    const { skip, limit, sort = DEFAULT_SORT } = query;
    const keywordOr = await buildTicketKeywordOrClauses(keyword, this.userRepository);

    return this.ticketRepository.listWithUsers({
      keywordOr,
      skip,
      limit,
      sort,
      ...getTicketListScope(user),
    });
  }

  async filterByStatus(
    query: TicketFilterQuery,
    user: AuthenticatedUser,
  ): Promise<ITicketPopulated[]> {
    if (!TICKET_STATUSES.includes(query.status)) {
      throw new ValidationException('Invalid ticket status');
    }

    const { status, skip, limit, sort = DEFAULT_SORT } = query;

    return this.ticketRepository.listWithUsers({
      status,
      skip,
      limit,
      sort,
      ...getTicketListScope(user),
    });
  }

  async listWithFilters(
    query: TicketListFilterQuery,
    user: AuthenticatedUser,
  ): Promise<ITicketPopulated[]> {
    const keyword = query.keyword?.trim();
    const { status, skip, limit, sort = DEFAULT_SORT } = query;

    if (status && !TICKET_STATUSES.includes(status)) {
      throw new ValidationException('Invalid ticket status');
    }

    if (!keyword && !status) {
      throw new ValidationException('Provide a search keyword and/or status filter');
    }

    const keywordOr = keyword
      ? await buildTicketKeywordOrClauses(keyword, this.userRepository)
      : undefined;

    return this.ticketRepository.listWithUsers({
      ...(keywordOr ? { keywordOr } : {}),
      ...(status ? { status } : {}),
      skip,
      limit,
      sort,
      ...getTicketListScope(user),
    });
  }
}

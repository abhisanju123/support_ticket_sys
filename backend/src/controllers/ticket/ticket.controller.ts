import type { Request, Response } from 'express';

import {
  ApiResponse,
  getAuthenticatedUser,
  getTicketNumberParam,
  getValidatedBody,
  getValidatedQuery,
} from '../../helpers/index.js';
import { asyncHandler } from '../../middlewares/index.js';
import type { DashboardStatisticsService } from '../../services/dashboard/dashboard-statistics.service.js';
import type { TicketDeletionService } from '../../services/ticket/ticket-deletion.service.js';
import type { TicketCreationService } from '../../services/ticket/ticket-creation.service.js';
import type { TicketRetrievalService } from '../../services/ticket/ticket-retrieval.service.js';
import type { TicketSearchFilterService } from '../../services/ticket/ticket-search-filter.service.js';
import type { TicketStatusService } from '../../services/ticket/ticket-status.service.js';
import type { TicketUpdateService } from '../../services/ticket/ticket-update.service.js';
import type { CreateTicketInput, UpdateTicketInput } from '../../services/types/index.js';
import type {
  ChangeTicketStatusBody,
  TicketListRequestQuery,
} from '../types/ticket.controller.types.js';

export class TicketController {
  constructor(
    private readonly ticketCreationService: TicketCreationService,
    private readonly ticketRetrievalService: TicketRetrievalService,
    private readonly ticketUpdateService: TicketUpdateService,
    private readonly ticketDeletionService: TicketDeletionService,
    private readonly ticketStatusService: TicketStatusService,
    private readonly ticketSearchFilterService: TicketSearchFilterService,
    private readonly dashboardStatisticsService: DashboardStatisticsService,
  ) {}

  createTicket = asyncHandler(async (req: Request, res: Response) => {
    const user = getAuthenticatedUser(req);
    const ticket = await this.ticketCreationService.createTicket(
      getValidatedBody<CreateTicketInput>(req),
      user,
    );

    ApiResponse.created(res, ticket, 'Ticket created successfully');
  });

  listTickets = asyncHandler(async (req: Request, res: Response) => {
    const user = getAuthenticatedUser(req);
    const query = getValidatedQuery<TicketListRequestQuery>(req);

    if (query.keyword || query.status) {
      const tickets = await this.ticketSearchFilterService.listWithFilters(
        {
          keyword: query.keyword,
          status: query.status,
          skip: query.skip,
          limit: query.limit,
          sort: query.sort,
        },
        user,
      );

      ApiResponse.success(res, tickets, 'Tickets retrieved successfully');
      return;
    }

    const tickets = await this.ticketRetrievalService.getAllTickets(
      {
        skip: query.skip,
        limit: query.limit,
        sort: query.sort,
      },
      user,
    );

    ApiResponse.success(res, tickets, 'Tickets retrieved successfully');
  });

  getTicketById = asyncHandler(async (req: Request, res: Response) => {
    const user = getAuthenticatedUser(req);
    const ticket = await this.ticketRetrievalService.getTicketById(
      getTicketNumberParam(req, 'id'),
      user,
    );

    ApiResponse.success(res, ticket, 'Ticket retrieved successfully');
  });

  updateTicket = asyncHandler(async (req: Request, res: Response) => {
    const user = getAuthenticatedUser(req);
    const ticket = await this.ticketUpdateService.updateTicket(
      getTicketNumberParam(req, 'id'),
      getValidatedBody<UpdateTicketInput>(req),
      user,
    );

    ApiResponse.success(res, ticket, 'Ticket updated successfully');
  });

  changeTicketStatus = asyncHandler(async (req: Request, res: Response) => {
    const user = getAuthenticatedUser(req);
    const { status } = getValidatedBody<ChangeTicketStatusBody>(req);

    const ticket = await this.ticketStatusService.transitionStatus(
      getTicketNumberParam(req, 'id'),
      status,
      user,
    );

    ApiResponse.success(res, ticket, 'Ticket status updated successfully');
  });

  deleteTicket = asyncHandler(async (req: Request, res: Response) => {
    await this.ticketDeletionService.deleteTicket(getTicketNumberParam(req, 'id'));

    ApiResponse.success(res, null, 'Ticket deleted successfully');
  });

  getDashboardStatistics = asyncHandler(async (req: Request, res: Response) => {
    const user = getAuthenticatedUser(req);
    const statistics = await this.dashboardStatisticsService.getStatistics(user);

    ApiResponse.success(res, statistics, 'Dashboard statistics retrieved successfully');
  });
}

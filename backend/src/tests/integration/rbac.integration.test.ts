import request from 'supertest';

import app from '../../app.js';
import { connectDatabase, disconnectDatabase } from '../../database/connection.js';
import { seedUsers } from '../../database/user-seed.js';
import { User } from '../../models/user.model.js';

interface LoginResponse {
  user: { _id: string; email: string; role: string };
  token: string;
}

const login = async (email: string, password = 'Password123!'): Promise<LoginResponse> => {
  const response = await request(app).post('/api/auth/login').send({ email, password });

  expect(response.status).toBe(200);
  expect(response.body.success).toBe(true);

  return response.body.data as LoginResponse;
};

const authHeader = (token: string) => ({ Authorization: `Bearer ${token}` });

const describeIntegration = describe;

describeIntegration('RBAC integration', () => {
  let employeeAuth: LoginResponse;
  let adminAuth: LoginResponse;
  let agentAuth: LoginResponse;
  let alternateEmployeeId: string;

  beforeAll(async () => {
    await connectDatabase();
    await seedUsers();

    employeeAuth = await login('emily@example.com');
    adminAuth = await login('jane@example.com');
    agentAuth = await login('john@example.com');

    const david = await User.findOne({ email: 'david@example.com' }).lean();
    alternateEmployeeId = david?._id.toString() ?? '';
    expect(alternateEmployeeId).toBeTruthy();
  }, 60_000);

  afterAll(async () => {
    await disconnectDatabase();
  }, 30_000);

  it('allows employees to create tickets only for themselves', async () => {
    const ownTicket = await request(app)
      .post('/api/tickets')
      .set(authHeader(employeeAuth.token))
      .send({
        title: 'Employee own ticket',
        description: 'Created during RBAC integration test',
        priority: 'medium',
        createdBy: employeeAuth.user._id,
        assignedTo: agentAuth.user._id,
      });

    expect(ownTicket.status).toBe(201);

    const invalidAssigneeTicket = await request(app)
      .post('/api/tickets')
      .set(authHeader(employeeAuth.token))
      .send({
        title: 'Employee invalid assignee',
        description: 'Should be rejected',
        priority: 'low',
        createdBy: employeeAuth.user._id,
        assignedTo: alternateEmployeeId,
      });

    expect(invalidAssigneeTicket.status).toBe(422);
  });

  it('denies ticket delete for employees and agents', async () => {
    const created = await request(app)
      .post('/api/tickets')
      .set(authHeader(adminAuth.token))
      .send({
        title: 'Delete permission test',
        description: 'Ticket for RBAC delete checks',
        priority: 'high',
        createdBy: adminAuth.user._id,
        assignedTo: adminAuth.user._id,
      });

    expect(created.status).toBe(201);
    const ticketNumber = created.body.data.ticketNumber;

    const employeeDelete = await request(app)
      .delete(`/api/tickets/${ticketNumber}`)
      .set(authHeader(employeeAuth.token));

    expect(employeeDelete.status).toBe(403);

    const agentDelete = await request(app)
      .delete(`/api/tickets/${ticketNumber}`)
      .set(authHeader(agentAuth.token));

    expect(agentDelete.status).toBe(403);

    const adminDelete = await request(app)
      .delete(`/api/tickets/${ticketNumber}`)
      .set(authHeader(adminAuth.token));

    expect(adminDelete.status).toBe(200);
  });

  it('denies status changes for employees', async () => {
    const created = await request(app)
      .post('/api/tickets')
      .set(authHeader(employeeAuth.token))
      .send({
        title: 'Status permission test',
        description: 'Ticket for RBAC status checks',
        priority: 'medium',
        createdBy: employeeAuth.user._id,
        assignedTo: agentAuth.user._id,
      });

    expect(created.status).toBe(201);
    const ticketNumber = created.body.data.ticketNumber;

    const employeeStatus = await request(app)
      .patch(`/api/tickets/${ticketNumber}/status`)
      .set(authHeader(employeeAuth.token))
      .send({ status: 'in_progress' });

    expect(employeeStatus.status).toBe(403);

    const agentStatus = await request(app)
      .patch(`/api/tickets/${ticketNumber}/status`)
      .set(authHeader(agentAuth.token))
      .send({ status: 'in_progress' });

    expect(agentStatus.status).toBe(200);
  });
});

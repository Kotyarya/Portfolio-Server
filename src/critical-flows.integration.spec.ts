import {INestApplication} from '@nestjs/common';
import {Test} from '@nestjs/testing';
import * as request from 'supertest';
import {ProjectsController} from './projects/projects.controller';
import {ProjectsService} from './projects/projects.service';
import {SkillsController} from './skills/skills.controller';
import {SkillsService} from './skills/skills.service';
import {BlocksController} from './blocks/blocks.controller';
import {BlocksService} from './blocks/blocks.service';
import {ContactController} from './contact/contact.controller';
import {ContactService} from './contact/contact.service';
import {ContactRateLimitService} from './contact/contact-rate-limit.service';
import {createValidationPipe} from './common/validation.pipe';
import type {Server} from 'node:http';
import {AllExceptionsFilter} from './common/AllExceptionsFilter.filter';

describe('Critical API flows', () => {
  let app: INestApplication;
  let httpServer: Server;
  let consoleErrorSpy: jest.SpiedFunction<typeof console.error>;
  const projectsService = {
    getAllProjects: jest.fn().mockResolvedValue({status: 200, message: 'Success', data: []}),
    getProjectById: jest.fn().mockResolvedValue({status: 200, message: 'Success', data: {id: 1}}),
    getProjectSkills: jest.fn().mockResolvedValue({status: 200, message: 'Success', data: []}),
    getProjectStatuses: jest.fn().mockResolvedValue({status: 200, message: 'Success', data: []}),
    getProjectCategories: jest.fn().mockResolvedValue({status: 200, message: 'Success', data: []}),
  };
  const skillsService = {
    getAllSkills: jest.fn().mockResolvedValue({status: 200, message: 'Success', data: []}),
    getSkillById: jest.fn().mockResolvedValue({status: 200, message: 'Success', data: {id: 1}}),
  };
  const blocksService = {
    getBlockData: jest.fn().mockResolvedValue({status: 200, message: 'Success', data: {title: 'Portfolio'}}),
  };
  const contactService = {sendToOwner: jest.fn().mockResolvedValue(undefined)};
  const contactRateLimit = {check: jest.fn()};

  beforeAll(async () => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);
    const moduleRef = await Test.createTestingModule({
      controllers: [ProjectsController, SkillsController, BlocksController, ContactController],
      providers: [
        {provide: ProjectsService, useValue: projectsService},
        {provide: SkillsService, useValue: skillsService},
        {provide: BlocksService, useValue: blocksService},
        {provide: ContactService, useValue: contactService},
        {provide: ContactRateLimitService, useValue: contactRateLimit},
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(createValidationPipe());
    app.useGlobalFilters(new AllExceptionsFilter());
    await app.init();
    httpServer = app.getHttpServer() as Server;
  });

  afterAll(async () => {
    consoleErrorSpy.mockRestore();
    await app.close();
  });

  it.each([
    ['/projects', 'getAllProjects'],
    ['/projects/1', 'getProjectById'],
    ['/skills', 'getAllSkills'],
    ['/skills/1', 'getSkillById'],
    ['/blocks/about_me', 'getBlockData'],
  ])('serves %s through its controller/service boundary', async (path) => {
    await request(httpServer).get(path).expect(200);
  });

  it('validates contact input without using SMTP or a production database', async () => {
    await request(httpServer)
      .post('/contact')
      .send({name: 'Recruiter', email: 'recruiter@example.com', message: 'Hello'})
      .expect(201)
      .expect({status: 200, message: 'Success', data: null});

    expect(contactService.sendToOwner).toHaveBeenCalledWith(
      'Recruiter',
      'recruiter@example.com',
      'Hello',
    );

    const invalidResponse = await request(httpServer)
      .post('/contact')
      .send({name: 'Recruiter', email: 'invalid', message: 'Hello', unexpected: true})
      .expect(400);

    expect(invalidResponse.body).toMatchObject({status: 400, data: null});
  });
});

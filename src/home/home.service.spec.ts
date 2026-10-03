import {HomeService} from './home.service';
import {PagesEnum} from '../types/pages-enum.types';

describe('HomeService', () => {
  it('aggregates the homepage into one stable response contract', async () => {
    const blocksService = {
      getBlockData: jest.fn((block: PagesEnum) => Promise.resolve({
        status: 200,
        message: 'Success',
        data: {title: block, subtitle: '', text: ''},
      })),
    };
    const projectsService = {
      getAllProjects: jest.fn().mockResolvedValue({status: 200, message: 'Success', data: [{id: 1}]}),
    };
    const skillsService = {
      getAllSkills: jest.fn().mockResolvedValue({status: 200, message: 'Success', data: [{id: 2}]}),
    };
    const service = new HomeService(blocksService as never, projectsService as never, skillsService as never);

    const response = await service.getHome();

    expect(response.status).toBe(200);
    expect(response.data).toMatchObject({
      projects: [{id: 1}],
      skills: [{id: 2}],
      aboutMe: {title: PagesEnum.ABOUT_ME_BLOCK},
      contactMe: {title: PagesEnum.CONTACT_ME_BLOCK},
    });
    expect(blocksService.getBlockData).toHaveBeenCalledTimes(4);
  });
});

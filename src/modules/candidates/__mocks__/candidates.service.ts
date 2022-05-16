import { mockCreated, mockRemoved, mockFoundAll, mockFoundOne, mockUpdated } from "./mockValues";

export const CandidatesService = jest.fn().mockReturnValue({
  findAll: jest.fn().mockResolvedValue(mockFoundAll),
  findOne: jest.fn().mockResolvedValue(mockFoundOne),
  create: jest.fn(item => {
    let generatedUuid = '73ca4916-0512-40eb-8dfb-e120ae784587'
    return {...item, id: generatedUuid, votedCount: 0}
  }),
  update: jest.fn((id, item) => {
    return {...item, id, votedCount: 0}
  }),
  remove: jest.fn((id) => {
    if (id === '73ca4916-0512-40eb-8dfb-e120ae784587') {
      return {
        status: 'ok'
      }
    } else {
      return {
        status: 'error',
        message: 'user not found'
      }
    }
  }),
});
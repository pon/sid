const id = require('../../app/utils/id')

describe('id util', () => {
  it('should generate a valid prefixed id', () => {
    id('prefix').should.match(/prefix_[a-z0-9]*/)
  })
})

module.exports = {
  transform: {
    '^.+\\.js$': "babel-jest",
    '^.+\\.jsx$': "babel-jest"
  },
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js']
}; 
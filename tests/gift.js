// //* eslint - disable no - undef * /
// import chai from 'chai';
// import chaiHttp from 'chai-http';
// import app from '../index';


// const { expect } = chai;
// let adminToken;
// let userToken;

// const login = {
//     email: 'sam@gmail.com',
//     password: 'alexzender45'
// }

// // chai middleware
// chai.use(chaiHttp);
// const signinUrl = '/api/v1/auth/signin';


// describe(`POST ${signinUrl}`, () => {
//     it('should sign in user successfully', (done) => {
//         chai
//             .request(app)
//             .post(signinUrl)
//             .send(login)
//         userToken = request.body.data.token;
//         expect(request.statusCode).to.equal(200);
//         done();
//     });
// });
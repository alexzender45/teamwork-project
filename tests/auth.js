/* eslint-disable no-undef */
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';

const normal_user = {
    first_name: 'Samuel',
    last_name: 'Alex',
    email: 'sam@gmail.com',
    password: 'alexzender45',
    gender: 'male',
    job_role: 'staff',
    department: 'Dev',
    address: 'lagos island'
};


const login = {
    email: 'sam@gmail.com',
    password: 'alexzender45'
}


const admin_user = {
    first_name: 'Mary',
    last_name: 'Alex',
    email: 'samuel@gmail.com',
    password: 'alexzender45',
    gender: 'male',
    job_role: 'staff',
    department: 'Dev',
    address: 'lagos island',
    is_admin: 'admin'
};
// Define the expect assertion
const { expect } = chai;

// chai middleware
chai.use(chaiHttp);

const signupUrl = '/api/v1/auth/signup';
const signinUrl = '/api/v1/auth/signin';

// signup test

describe(`POST ${signupUrl}`, () => {
    it('should sign up admin user account successfully', (done) => {
        chai
            .request(app)
            .post(signupUrl)
            .send(admin_user)
            .end((err, res) => {
                expect(res.status).to.equal(201);
                done();
            });
    });
});


describe(`POST ${signupUrl}`, () => {
    it('should  signup normal_user successfully', (done) => {
        chai
            .request(app)
            .post(signupUrl)
            .send(normal_user)
            .end((err, res) => {
                expect(res.status).to.be.equal(201);
                done();
            });
    });
});


// signin test
describe(`POST ${signinUrl}`, () => {
    it('should sign in user successfully', (done) => {
        chai
            .request(app)
            .post(signinUrl)
            .send(login)
            .end((err, res) => {
                expect(res.status).to.be.equal(201);
                done();
            });
    });
});
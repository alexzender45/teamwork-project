import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/index';
import db from '../src/model/db'

// Define the expect assertion
const { expect } = chai;

// chai middleware
chai.use(chaiHttp);

let admintoken;
let token;

describe('User Auth', () => {
    before((done) => {
        const deleteArticleComments = `INSERT INTO users(
            first_name, last_name, email, password, gender, job_role, department, address, is_admin, is_logged_in) VALUES
           ('Samuel', 'Alexsam', 'admin@gmail.com', '$2b$10$VjcZX65V931V6jbyZpxvHOHiblrRMSqrQt5x.8LhrdR7P4/ZgMe4.', 'male', 'admin', 'IT', '36 lagos island', 'true', 'true');`
        db.query(deleteArticleComments, () => {
            chai.request(app)
                .post('/api/v1/auth/signin')
                .send({
                    email: 'admin@gmail.com',
                    password: 'alexzender45'
                })
                .end((err, res) => {
                    expect(res.status).to.be.equal(201);
                    expect(res.body.status).to.equal('success');
                    expect(res.body).to.have.property('status');
                    expect(res.body).to.have.property('data');
                    expect(res.body.data).to.have.property('user_id');
                    expect(res.body.data).to.have.property('token');
                    admintoken;
                    admintoken = res.body.data.token;
                    done();
                    console.log(err)
                });
        }).catch((e) => console.log(e.message));
    });
    it('should signin admin user successfully', (done) => {
        chai
            .request(app)
            .post('/api/v1/auth/signin')
            .send({
                email: 'admin@gmail.com',
                password: 'alexzender45',
            })
            .end((err, res) => {
                expect(res.status).to.be.equal(201);
                expect(res.body.status).to.equal('success');
                expect(res.body).to.have.property('status');
                expect(res.body).to.have.property('data');
                expect(res.body.data).to.have.property('user_id');
                expect(res.body.data).to.have.property('token');
                expect(res.body).to.be.an('object');
                admintoken = res.body.data.token;
                done();
            });
    });

    it('admin should add user account successfully', (done) => {
        chai
            .request(app)
            .post('/api/v1/auth/create_user')
            .set('token', admintoken)
            .send({
                first_name: 'Hope',
                last_name: 'Ejiro',
                email: 'hopeejiro@gmail.com',
                password: 'passwordhope45',
                gender: 'female',
                job_role: 'Staff',
                department: 'Medicine',
                address: 'Abuja Nigeria',
            })
            .end((err, res) => {
                expect(res.status).to.be.equal(201);
                expect(res.body.status).to.equal('success');
                expect(res.body).to.have.property('status');
                expect(res.body).to.have.property('data');
                expect(res.body.data).to.have.property('user_id');
                expect(res.body.data).to.have.property('token');
                expect(res.body).to.be.an('object');
                token;
                token = res.body.data.token;
                done();
            });
    })
    it('user should signin successfully', (done) => {
        chai
            .request(app)
            .post('/api/v1/auth/signin')
            .send({
                email: 'hopeejiro@gmail.com',
                password: 'passwordhope45',
            })
            .end((err, res) => {
                expect(res.status).to.be.equal(201);
                expect(res.body.status).to.equal('success');
                expect(res.body).to.have.property('status');
                expect(res.body).to.have.property('data');
                expect(res.body.data).to.have.property('user_id');
                expect(res.body.data).to.have.property('token');
                expect(res.body).to.be.an('object');
                token;
                token = res.body.data.token;
                done();
            });
    })
});

describe('Articles', () => {
    it('should signin existing user successfully', (done) => {
        chai
            .request(app)
            .post('/api/v1/auth/signin')
            .send({
                email: 'hopeejiro@gmail.com',
                password: 'passwordhope45',
            })
            .end((err, res) => {
                expect(res.status).to.be.equal(201);
                expect(res.body.status).to.equal('success');
                expect(res.body).to.have.property('status');
                expect(res.body).to.have.property('data');
                expect(res.body.data).to.have.property('user_id');
                expect(res.body.data).to.have.property('token');
                expect(res.body).to.be.an('object');
                token;
                token = res.body.data.token;
                done();
            });
    })
    it('user should add articles successfully', (done) => {
        chai
            .request(app)
            .post('/api/v1/articles')
            .set('token', token)
            .send({
                title: 'Test articles',
                article: 'Articles to check for the day',
            })
            .end((err, res) => {
                expect(res.status).to.be.equal(201);
                expect(res.body.status).to.equal('success');
                expect(res.body).to.have.property('status');
                expect(res.body).to.have.property('data');
                expect(res.body.data).to.have.property('message');
                expect(res.body.data).to.have.property('article_id');
                expect(res.body.data).to.have.property('created_on');
                expect(res.body.data).to.have.property('title');
                expect(res.body).to.be.an('object');
                done();
            });
    })
})

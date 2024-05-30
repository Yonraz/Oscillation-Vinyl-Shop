import  request from 'supertest';
import { app } from '../../app';

function createTicket() {
    return request(app)
        .post('/api/tickets')
        .set('Cookie', global.signup())
        .send({
            title: 'title',
            price: 20
        })

}

it('fetches a list of tickets', async () => {
    //create 3 tickets
    await createTicket();
    await createTicket();
    await createTicket();
    // get all tickets
    const response = await request(app)
        .get('/api/tickets')
        .send()
        .expect(200)
        
    expect(response.body.length).toEqual(3)
})
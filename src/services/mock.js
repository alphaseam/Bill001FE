
//testing the application from MockAdapter

import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

const mock = new MockAdapter(axios, { delayResponse: 500 });

// Mock login endpoint
mock.onPost('/auth/login').reply(config => {
    const { email, password } = JSON.parse(config.data);
    if (email === 'test@example.com' && password === '123456') {
        return [200, {
            token: 'mocked_token',
            user: { name: 'Test User', email },
        }];
    } else {
        return [401, { error: 'Invalid credentials' }];
    }
});

// Mock dashboard
mock.onGet('/dashboard').reply(200, {
    message: 'This is protected dashboard data',
});

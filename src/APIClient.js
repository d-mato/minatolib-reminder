import {EventEmitter} from 'events';
import fs from 'fs';
import request from 'request';

const tokenFile = 'token.json';
const CLIENT_ID = '694031506938-bmesuc57vih2tq9jhgiqhldul79d8ceu.apps.googleusercontent.com';
const CLIENT_SECRET = 'jrYssZs0AVbFF4Wpnfx5rHRq';

class APIClient extends EventEmitter {
  constructor() {
    super();
    this.token = JSON.parse(fs.readFileSync(tokenFile, 'utf-8'));
    this.testAccessToken();
  }

  testAccessToken() {
    let url = `https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${this.token.access_token}`;
    request.get(url, (err, res, body) => {
      if (err) {
        console.log(err);
        process.exit();
      }
      if (res.statusCode != 200) {
        console.log('Get new access token ...');
        this.refreshAccessToken();
      } else
        this.emitReady();
    });
  }

  refreshAccessToken() {
    let url = 'https://www.googleapis.com/oauth2/v4/token';
    let data = {
      refresh_token: this.token.refresh_token,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: 'refresh_token',
    };
    request.post(url, {form: data, json: true}, (err, res, json) => {
      if (err) {
        console.log(err);
        process.exit();
      }
      this.token.access_token = json.access_token;
      fs.writeFile(tokenFile, JSON.stringify(this.token));
      this.emitReady();
    });
  }

  emitReady() {
    this.emit('ready', this.token.access_token);
  }
}

export default new APIClient();

# Box API Node.JS Client

## Install

    npm install nodejs-box

## Setup

First, you need to go through the [OAuth2](http://developers.box.com/oauth/) process with Box.com, so that you can receive an access token.
I recommend the [box-passport](https://github.com/bluedge/passport-box) module to help with this.

```javascript
var Box = require('nodejs-box');

var box = new Box({
  access_token: 'YOUR_ACCESS_TOKEN_GOES_HERE',
  refreh_token: 'YOUR_REFRESH_TOKEN_GOES_HERE'
});
```

### UPDATED README COMING SOON

//eslint-disable-next-line no-unused-vars
import KAnalyticsPlugin from '../../src/kanalytics'
import {loadPlayer, VERSION} from 'playkit-js'
import * as TestUtils from 'playkit-js/test/src/utils/test-utils'

const targetId = 'player-placeholder_kanalytics.spec';

describe('KAnalyticsPlugin', function () {
  let player, sandbox, sendSpy, config;

  /**
   * @param {string} ks - ks
   * @param {Object} event - event
   * @return {void}
   */
  function verifyPayloadProperties(ks, event) {
    ks.should.equal(player.config.session.ks);
    event.clientVer.should.equal(VERSION);
    event.partnerId.should.equal(player.config.session.partnerID);
    event.widgetId.should.equal("_" + player.config.session.partnerID);
    event.uiconfId.should.equal(player.config.session.uiConfID);
    event.entryId.should.equal(player.config.id);
    event.referrer.should.equal(document.referrer);
    if (event.duration) {
      event.duration.should.equal(player.duration);
    }
  }

  before(function () {
    config = {
      id: "1_rwbj3j0a",
      session: {
        "partnerID": 1068292,
        "ks": "NTAwZjViZWZjY2NjNTRkNGEyMjU1MTg4OGE1NmUwNDljZWJkMzk1MXwxMDY4MjkyOzEwNjgyOTI7MTQ5MDE3NjE0NjswOzE0OTAwODk3NDYuMDIyNjswO3ZpZXc6Kix3aWRnZXQ6MTs7",
        "uiConfID": 123456
      },
      sources: {
        progressive: [{
          "mimetype": "video/mp4",
          "url": "https://www.w3schools.com/tags/movie.mp4",
          "id": "1_rwbj3j0a_11311,applehttp"
        }]
      },
      plugins: {
        'kanalytics': {}
      }
    };
    TestUtils.createElement('DIV', targetId);
  });

  beforeEach(function () {
    sandbox = sinon.sandbox.create();
    sendSpy = sandbox.spy(XMLHttpRequest.prototype, 'send');
    player = loadPlayer(targetId, config);
  });

  afterEach(function () {
    sandbox.restore();
    player.destroy();
    TestUtils.removeVideoElementsFromTestPage();
  });

  after(function () {
    TestUtils.removeElement(targetId);
  });

  it('should send widget loaded', () => {
    let payload = JSON.parse(sendSpy.lastCall.args[0]);
    verifyPayloadProperties(payload.ks, payload.event);
    payload.event.seek.should.be.false;
    payload.event.eventType.should.equal(1);
  });

  it('should send media loaded', (done) => {
    player.ready().then(() => {
      let payload = JSON.parse(sendSpy.lastCall.args[0]);
      verifyPayloadProperties(payload.ks, payload.event);
      payload.event.seek.should.be.false;
      payload.event.eventType.should.equal(2);
      done();
    });
    player.load();
  });

  it('should send first play', (done) => {
    player.addEventListener(player.Event.FIRST_PLAY, () => {
      let payload = JSON.parse(sendSpy.lastCall.args[0]);
      verifyPayloadProperties(payload.ks, payload.event);
      payload.event.seek.should.be.false;
      payload.event.eventType.should.equal(3);
      done();
    });
    player.play();
  });

  it('should send replay', (done) => {
    player.addEventListener(player.Event.FIRST_PLAY, () => {
      player.currentTime = player.duration - 1;
    });
    player.addEventListener(player.Event.ENDED, () => {
      player.addEventListener(player.Event.PLAY, () => {
        let payload = JSON.parse(sendSpy.lastCall.args[0]);
        verifyPayloadProperties(payload.ks, payload.event);
        payload.event.seek.should.be.true;
        payload.event.eventType.should.equal(16);
        done();
      });
      player.play();
    });
    player.play();
  });

  it('should send seek on playing', (done) => {
    player.addEventListener(player.Event.FIRST_PLAY, () => {
      player.currentTime = player.duration / 2;
    });
    player.addEventListener(player.Event.SEEKED, () => {
      let payload = JSON.parse(sendSpy.lastCall.args[0]);
      verifyPayloadProperties(payload.ks, payload.event);
      payload.event.seek.should.be.false;
      payload.event.eventType.should.equal(17);
      done();
    });
    player.play();
  });

  it('should send seek before playing', (done) => {
    player.addEventListener(player.Event.LOADED_METADATA, () => {
      player.currentTime = player.duration / 2;
    });
    player.addEventListener(player.Event.SEEKED, () => {
      let payload = JSON.parse(sendSpy.lastCall.args[0]);
      verifyPayloadProperties(payload.ks, payload.event);
      payload.event.seek.should.be.false;
      payload.event.eventType.should.equal(17);
      done();
    });
    player.load();
  });

  it('should send buffer start', () => {
    player.dispatchEvent({type: player.Event.PLAYER_STATE_CHANGED, payload:{
      'newState': player.State.BUFFERING
    }});
    let payload = JSON.parse(sendSpy.lastCall.args[0]);
    verifyPayloadProperties(payload.ks, payload.event);
    payload.event.seek.should.be.false;
    payload.event.eventType.should.equal(12);
  });

  it('should send buffer end', () => {
    player.dispatchEvent({type: player.Event.PLAYER_STATE_CHANGED, payload:{
      'oldState': player.State.BUFFERING
    }});
    let payload = JSON.parse(sendSpy.lastCall.args[0]);
    verifyPayloadProperties(payload.ks, payload.event);
    payload.event.seek.should.be.false;
    payload.event.eventType.should.equal(13);
  });

  it('should send 25%', (done) => {
    player.addEventListener(player.Event.LOADED_METADATA, () => {
      player.currentTime = 4;
    });
    player.addEventListener(player.Event.TIME_UPDATE, () => {
      let payload = JSON.parse(sendSpy.lastCall.args[0]);
      verifyPayloadProperties(payload.ks, payload.event);
      payload.event.eventType.should.equal(4);
      done();
    });
    player.load();
  });

  it('should send 50%', (done) => {
    player.addEventListener(player.Event.LOADED_METADATA, () => {
      player.currentTime = 7;
    });
    player.addEventListener(player.Event.TIME_UPDATE, () => {
      let payload = JSON.parse(sendSpy.lastCall.args[0]);
      verifyPayloadProperties(payload.ks, payload.event);
      payload.event.eventType.should.equal(5);
      done();
    });
    player.load();
  });

  it('should send 75%', (done) => {
    player.addEventListener(player.Event.LOADED_METADATA, () => {
      player.currentTime = 10;
    });
    player.addEventListener(player.Event.TIME_UPDATE, () => {
      let payload = JSON.parse(sendSpy.lastCall.args[0]);
      verifyPayloadProperties(payload.ks, payload.event);
      payload.event.eventType.should.equal(6);
      done();
    });
    player.load();
  });

  it('should send 100%', (done) => {
    player.addEventListener(player.Event.LOADED_METADATA, () => {
      player.currentTime = 12.5;
    });
    player.addEventListener(player.Event.TIME_UPDATE, () => {
      let payload = JSON.parse(sendSpy.lastCall.args[0]);
      verifyPayloadProperties(payload.ks, payload.event);
      payload.event.eventType.should.equal(7);
      done();
    });
    player.load();
  });

  it('should send 25% - 100%', (done) => {
    let onTimeUpdate = () => {
      player.removeEventListener(player.Event.TIME_UPDATE, onTimeUpdate);
      let payload25 = JSON.parse(sendSpy.getCall(1).args[0]);
      let payload50 = JSON.parse(sendSpy.getCall(2).args[0]);
      let payload75 = JSON.parse(sendSpy.getCall(3).args[0]);
      let payload100 = JSON.parse(sendSpy.getCall(4).args[0]);
      payload25.event.eventType.should.equal(4);
      payload50.event.eventType.should.equal(5);
      payload75.event.eventType.should.equal(6);
      payload100.event.eventType.should.equal(7);
      done();
    };
    player.addEventListener(player.Event.LOADED_METADATA, () => {
      player.addEventListener(player.Event.TIME_UPDATE, onTimeUpdate);
      player.currentTime = 12.5;
    });
    player.load();
  });
});

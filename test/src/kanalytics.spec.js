//eslint-disable-next-line no-unused-vars
import KAnalyticsPlugin from '../../src/kanalytics'
import {loadPlayer} from 'playkit-js'
import * as TestUtils from 'playkit-js/test/src/utils/test-utils'

describe('KAnalyticsPlugin', function () {
  let player, sandbox, sendSpy, config;

  const playerVersion = '1.2.3';

  /**
   * @param {string} ks - ks
   * @param {Object} event - event
   * @return {void}
   */
  function verifyPayloadProperties(ks, event) {
    ks.should.equal(player.config.session.ks);
    event.clientVer.should.equal(playerVersion);
    event.partnerId.should.equal(player.config.session.partnerID);
    event.widgetId.should.equal("_" + player.config.session.partnerID);
    event.uiConfId.should.equal(player.config.session.uiConfID);
    event.entryId.should.equal(player.config.id);
    event.referrer.should.equal(document.referrer);
    event.hasKanalony.should.be.false;
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
        'kanalytics': {
          playerVersion: playerVersion,
          entryId: "1_rwbj3j0a",
          entryType: "vod",
          sessionId: "7296b4fd-3fcb-666d-51fc-34065579334c",
          uiConfId: 123456,
          ks: "NTAwZjViZWZjY2NjNTRkNGEyMjU1MTg4OGE1NmUwNDljZWJkMzk1MXwxMDY4MjkyOzEwNjgyOTI7MTQ5MDE3NjE0NjswOzE0OTAwODk3NDYuMDIyNjswO3ZpZXc6Kix3aWRnZXQ6MTs7",
          partnerId: 1068292
        }
      }
    };
  });

  beforeEach(function () {
    sandbox = sinon.sandbox.create();
    sendSpy = sandbox.spy(XMLHttpRequest.prototype, 'send');
    player = loadPlayer(config);
  });

  afterEach(function () {
    sandbox.restore();
    player.destroy();
    TestUtils.removeVideoElementsFromTestPage();
  });

  it('should send widget loaded', () => {
    let payload = sendSpy.lastCall.args[0];
    verifyPayloadProperties(payload.ks, payload.event);
    payload.event.seek.should.be.false;
    payload.event.eventType.should.equal(1);
  });

  it('should send media loaded', (done) => {
    player.ready().then(() => {
      let payload = sendSpy.lastCall.args[0];
      verifyPayloadProperties(payload.ks, payload.event);
      payload.event.seek.should.be.false;
      payload.event.eventType.should.equal(2);
      done();
    });
    player.load();
  });

  it('should send first play', (done) => {
    player.addEventListener(player.Event.FIRST_PLAY, () => {
      let payload = sendSpy.lastCall.args[0];
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
        let payload = sendSpy.lastCall.args[0];
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
      let payload = sendSpy.lastCall.args[0];
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
      let payload = sendSpy.lastCall.args[0];
      verifyPayloadProperties(payload.ks, payload.event);
      payload.event.seek.should.be.false;
      payload.event.eventType.should.equal(17);
      done();
    });
    player.load();
  });

  it('should send buffer start', () => {
    player.dispatchEvent({type: player.Event.PLAYER_STATE_CHANGED, payload:{
      'newState': {
        'type': player.State.BUFFERING
      },
      'oldState': {
        'type': player.State.PLAYING
      }
    }});
    let payload = sendSpy.lastCall.args[0];
    verifyPayloadProperties(payload.ks, payload.event);
    payload.event.seek.should.be.false;
    payload.event.eventType.should.equal(12);
  });

  it('should send buffer end', () => {
    player.dispatchEvent({type: player.Event.PLAYER_STATE_CHANGED, payload:{
      'newState': {
        'type': player.State.PLAYING
      },
      'oldState': {
        'type': player.State.BUFFERING
      }
    }});
    let payload = sendSpy.lastCall.args[0];
    verifyPayloadProperties(payload.ks, payload.event);
    payload.event.seek.should.be.false;
    payload.event.eventType.should.equal(13);
  });

  it('should send 25%', (done) => {
    player.addEventListener(player.Event.LOADED_METADATA, () => {
      player.currentTime = 4;
    });
    player.addEventListener(player.Event.TIME_UPDATE, () => {
      let payload = sendSpy.lastCall.args[0];
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
      let payload = sendSpy.lastCall.args[0];
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
      let payload = sendSpy.lastCall.args[0];
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
      let payload = sendSpy.lastCall.args[0];
      verifyPayloadProperties(payload.ks, payload.event);
      payload.event.eventType.should.equal(7);
      done();
    });
    player.load();
  });

  it('should send 25% - 100%', (done) => {
    let onTimeUpdate = () => {
      player.removeEventListener(player.Event.TIME_UPDATE, onTimeUpdate);
      let payload25 = sendSpy.getCall(1).args[0];
      let payload50 = sendSpy.getCall(2).args[0];
      let payload75 = sendSpy.getCall(3).args[0];
      let payload100 = sendSpy.getCall(4).args[0];
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

  it('should not send 25% - 100% for live', (done) => {
    player._config.type = 'Live';
    let onTimeUpdate = () => {
      player.removeEventListener(player.Event.TIME_UPDATE, onTimeUpdate);
      let payload = sendSpy.lastCall.args[0];
      payload.event.eventType.should.equal(2);
      done();
    };
    player.addEventListener(player.Event.LOADED_DATA, () => {
      player.addEventListener(player.Event.TIME_UPDATE, onTimeUpdate);
      player.currentTime = 12.5;
    });
    player.load();
  });
});

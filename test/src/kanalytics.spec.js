//eslint-disable-next-line no-unused-vars
import kanalytics from '../../src/kanalytics.js'
import {playkit, VERSION} from 'playkit-js'
import * as TestUtils from 'playkit-js/test/src/utils/test-utils'


describe('KanalyticsPlugin', function () {
  let player, sandbox, sendSpy;
  let config = {
    "id": "1_rwbj3j0a",
    "session": {
      "partnerID": 1068292,
      "ks": "NTAwZjViZWZjY2NjNTRkNGEyMjU1MTg4OGE1NmUwNDljZWJkMzk1MXwxMDY4MjkyOzEwNjgyOTI7MTQ5MDE3NjE0NjswOzE0OTAwODk3NDYuMDIyNjswO3ZpZXc6Kix3aWRnZXQ6MTs7",
      "uiConfID": 123456
    },
    "sources": [
      {
        "mimetype": "video/mp4",
        "url": "https://www.w3schools.com/tags/movie.mp4",
        "id": "1_rwbj3j0a_11311,applehttp"
      }
    ],
    "plugins": {
      'kanalytics': {}
    }
  };

  /**
   * @param {string} ks - ks
   * @param {Object} event - event
   * @return {void}
   */
  function verifyPayloadProperties(ks, event) {
    ks.should.equal(player.config.session.ks);
    event.clientVer.should.equal(VERSION);
    event.duration.should.equal(player.duration);
    event.partnerId.should.equal(player.config.session.partnerID);
    event.widgetId.should.equal("_" + player.config.session.partnerID);
    event.uiconfId.should.equal(player.config.session.uiConfID);
    event.entryId.should.equal(player.config.id);
    event.contextId.should.equal(0);
    event.featureType.should.equal(0);
    event.applicationId.should.equal('');
    event.userId.should.equal(0);
    event.referrer.should.equal(document.referrer);
  }

  beforeEach(() => {
    player = playkit(config);
    sandbox = sinon.sandbox.create();
    sendSpy = sandbox.spy(XMLHttpRequest.prototype, 'send');
  });

  afterEach(() => {
    sandbox.restore();
    player.destroy();
    TestUtils.removeVideoElementsFromTestPage();
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
    player.addEventListener(player.Event.LOADED_METADATA, () => {
      player.currentTime = 12.5;
    });
    player.addEventListener(player.Event.TIME_UPDATE, () => {
      let payloadFirst = JSON.parse(sendSpy.firstCall.args[0]);
      let payloadSecond = JSON.parse(sendSpy.secondCall.args[0]);
      let payloadThird = JSON.parse(sendSpy.thirdCall.args[0]);
      let payloadLast = JSON.parse(sendSpy.lastCall.args[0]);
      payloadFirst.event.eventType.should.equal(4);
      payloadSecond.event.eventType.should.equal(5);
      payloadThird.event.eventType.should.equal(6);
      payloadLast.event.eventType.should.equal(7);
      done();
    });
    player.load();
  });
});

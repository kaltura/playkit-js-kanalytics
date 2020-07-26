import '../../src/index';
import {loadPlayer} from '@playkit-js/playkit-js';
import * as TestUtils from './utils/test-utils';

describe('KAnalyticsPlugin', function() {
  let player, sandbox, sendSpy, config;
  const playerVersion = '1.2.3';
  const ks =
    'NTAwZjViZWZjY2NjNTRkNGEyMjU1MTg4OGE1NmUwNDljZWJkMzk1MXwxMDY4MjkyOzEwNjgyOTI7MTQ5MDE3NjE0NjswOzE0OTAwODk3NDYuMDIyNjswO3ZpZXc6Kix3aWRnZXQ6MTs7';
  const type = 'vod';
  const id = '1_rwbj3j0a';
  const pId = 1068292;
  const uId = 123456;
  const sId = '7296b4fd-3fcb-666d-51fc-34065579334c';

  before(function() {
    config = {
      id: id,
      session: {
        partnerID: pId,
        ks: ks,
        uiConfID: uId
      },
      sources: {
        progressive: [
          {
            mimetype: 'video/mp4',
            url: 'https://www.w3schools.com/tags/movie.mp4',
            id: '1_rwbj3j0a_11311,applehttp'
          }
        ]
      },
      plugins: {
        kanalytics: {
          playerVersion: playerVersion,
          entryId: id,
          entryType: type,
          sessionId: sId,
          uiConfId: uId,
          ks: ks,
          partnerId: pId,
          referrer: document.URL
        }
      }
    };
  });

  afterEach(function() {
    sandbox.restore();
    player.destroy();
    TestUtils.removeVideoElementsFromTestPage();
  });

  describe('Basic Playback', function() {
    /**
     * @param {string} ks - ks
     * @param {Object} event - event
     * @return {void}
     */
    function verifyPayloadProperties(payload) {
      payload.ks.should.equal(ks);
      const event = payload.event;
      event.clientVer.should.equal(playerVersion);
      event.partnerId.should.equal(pId);
      event.widgetId.should.equal('_' + pId);
      event.uiConfId.should.equal(uId);
      event.entryId.should.equal(id);
      event.referrer.should.equal(document.URL);
      payload.hasKanalony.should.be.false;
      if (event.duration) {
        event.duration.should.equal(12.612);
      }
      ('playlistId' in event).should.be.false;
    }

    beforeEach(function() {
      sandbox = sinon.createSandbox();
      sendSpy = sandbox.spy(XMLHttpRequest.prototype, 'send');
      player = loadPlayer(config);
    });

    it('should send widget loaded before load', () => {
      const payload = sendSpy.firstCall.args[0];
      verifyPayloadProperties(payload);
      payload.event.seek.should.be.false;
      payload.event.eventType.should.equal(1);
    });

    it('should send media loaded', done => {
      player.ready().then(() => {
        const payload = sendSpy.lastCall.args[0];
        verifyPayloadProperties(payload);
        payload.event.seek.should.be.false;
        payload.event.eventType.should.equal(2);
        done();
      });
      player.load();
    });

    it('should send first play', done => {
      player.addEventListener(player.Event.FIRST_PLAY, () => {
        const payload = sendSpy.lastCall.args[0];
        verifyPayloadProperties(payload);
        payload.event.seek.should.be.false;
        payload.event.eventType.should.equal(3);
        done();
      });
      player.play();
    });

    it('should send replay', done => {
      player.addEventListener(player.Event.FIRST_PLAY, () => {
        player.currentTime = player.duration - 1;
      });
      player.addEventListener(player.Event.ENDED, () => {
        player.addEventListener(player.Event.PLAY, () => {
          const payload = sendSpy.lastCall.args[0];
          verifyPayloadProperties(payload);
          payload.event.seek.should.be.true;
          payload.event.eventType.should.equal(16);
          done();
        });
        player.play();
      });
      player.play();
    });

    it('should send seek on playing', done => {
      player.addEventListener(player.Event.FIRST_PLAY, () => {
        player.currentTime = player.duration / 2;
      });
      player.addEventListener(player.Event.SEEKED, () => {
        const payload = sendSpy.lastCall.args[0];
        verifyPayloadProperties(payload);
        payload.event.seek.should.be.false;
        payload.event.eventType.should.equal(17);
        done();
      });
      player.play();
    });

    it('should send seek before playing', done => {
      player.addEventListener(player.Event.LOADED_METADATA, () => {
        player.currentTime = player.duration / 2;
      });
      player.addEventListener(player.Event.SEEKED, () => {
        const payload = sendSpy.lastCall.args[0];
        verifyPayloadProperties(payload);
        payload.event.seek.should.be.false;
        payload.event.eventType.should.equal(17);
        done();
      });
      player.load();
    });

    it('should not send seek for live', done => {
      player._config.type = 'Live';
      player.addEventListener(player.Event.FIRST_PLAY, () => {
        player.currentTime = player.duration / 2;
      });
      player.addEventListener(player.Event.SEEKED, () => {
        const payload = sendSpy.lastCall.args[0];
        payload.event.eventType.should.not.equal(17);
        done();
      });
      player.play();
    });

    it('should send seek for live + dvr', done => {
      player._config.type = 'Live';
      player._config.dvr = true;
      player.addEventListener(player.Event.FIRST_PLAY, () => {
        player.currentTime = player.duration / 2;
      });
      player.addEventListener(player.Event.SEEKED, () => {
        const payload = sendSpy.lastCall.args[0];
        payload.event.eventType.should.equal(17);
        done();
      });
      player.play();
    });
    it('should send buffer start', () => {
      player.dispatchEvent({
        type: player.Event.PLAYER_STATE_CHANGED,
        payload: {
          newState: {
            type: player.State.BUFFERING
          },
          oldState: {
            type: player.State.PLAYING
          }
        }
      });
      const payload = sendSpy.lastCall.args[0];
      verifyPayloadProperties(payload);
      payload.event.seek.should.be.false;
      payload.event.eventType.should.equal(12);
    });

    it('should send buffer end', () => {
      player.dispatchEvent({
        type: player.Event.PLAYER_STATE_CHANGED,
        payload: {
          newState: {
            type: player.State.PLAYING
          },
          oldState: {
            type: player.State.BUFFERING
          }
        }
      });
      const payload = sendSpy.lastCall.args[0];
      verifyPayloadProperties(payload);
      payload.event.seek.should.be.false;
      payload.event.eventType.should.equal(13);
    });

    it('should send 25%', done => {
      player.addEventListener(player.Event.LOADED_METADATA, () => {
        player.currentTime = 4;
      });
      player.addEventListener(player.Event.TIME_UPDATE, () => {
        const payload = sendSpy.lastCall.args[0];
        verifyPayloadProperties(payload);
        payload.event.eventType.should.equal(4);
        done();
      });
      player.load();
    });

    it('should send 50%', done => {
      player.addEventListener(player.Event.LOADED_METADATA, () => {
        player.currentTime = 7;
      });
      player.addEventListener(player.Event.TIME_UPDATE, () => {
        const payload = sendSpy.lastCall.args[0];
        verifyPayloadProperties(payload);
        payload.event.eventType.should.equal(5);
        done();
      });
      player.load();
    });

    it('should send 75%', done => {
      player.addEventListener(player.Event.LOADED_METADATA, () => {
        player.currentTime = 10;
      });
      player.addEventListener(player.Event.TIME_UPDATE, () => {
        const payload = sendSpy.lastCall.args[0];
        verifyPayloadProperties(payload);
        payload.event.eventType.should.equal(6);
        done();
      });
      player.load();
    });

    it('should send 100%', done => {
      player.addEventListener(player.Event.LOADED_METADATA, () => {
        player.getVideoElement().currentTime = 12.7;
      });
      player.addEventListener(player.Event.TIME_UPDATE, () => {
        const payload = sendSpy.lastCall.args[0];
        verifyPayloadProperties(payload);
        payload.event.eventType.should.equal(7);
        done();
      });
      player.load();
    });

    it('should send 25% - 100%', done => {
      const onTimeUpdate = () => {
        player.removeEventListener(player.Event.TIME_UPDATE, onTimeUpdate);
        const payload25 = sendSpy.getCall(1).args[0];
        const payload50 = sendSpy.getCall(2).args[0];
        const payload75 = sendSpy.getCall(3).args[0];
        const payload100 = sendSpy.getCall(4).args[0];
        payload25.event.eventType.should.equal(4);
        payload50.event.eventType.should.equal(5);
        payload75.event.eventType.should.equal(6);
        payload100.event.eventType.should.equal(7);
        done();
      };
      player.addEventListener(player.Event.LOADED_METADATA, () => {
        player.addEventListener(player.Event.TIME_UPDATE, onTimeUpdate);
        player.getVideoElement().currentTime = 12.7;
      });
      player.load();
    });

    it('should not send 25% - 100% again while replay', done => {
      player.addEventListener(player.Event.FIRST_PLAY, () => {
        player.currentTime = player.duration - 1;
      });
      player.addEventListener(player.Event.ENDED, () => {
        player.addEventListener(player.Event.PLAY, () => {
          const onTimeUpdate = () => {
            player.removeEventListener(player.Event.TIME_UPDATE, onTimeUpdate);
            const payload = sendSpy.lastCall.args[0];
            payload.event.eventType.should.equal(16);
            done();
          };
          player.addEventListener(player.Event.TIME_UPDATE, onTimeUpdate);
          player.currentTime = 12.5;
        });
        player.play();
      });
      player.play();
    });
  });

  describe('Change Media', function() {
    const cm_ks =
      'MGI3MzFmMmUwN2IyYmYzN2IxOGEzZjFjMTAzM2U4NTg5MTgyY2MyZnwxMDkxOzEwOTE7MTUwNjY5Mjc0MzswOzE1MDY2MDYzNDMuMTE0MjswO3ZpZXc6Kix3aWRnZXQ6MTs7';
    const cm_type = 'live';
    const cm_id = '1_fdsguh765';
    const cm_plId = '12345678';
    const cm_pId = 2046854;
    const cm_uId = 654321;
    const cm_sId = '15282f1c-fff6-4130-3351-cb8bd39f0cdd';

    const CMconfig = {
      id: cm_id,
      session: {
        partnerID: cm_pId,
        ks: cm_ks,
        uiConfID: cm_uId
      },
      sources: {
        progressive: [
          {
            mimetype: 'video/mp4',
            url: 'https://www.w3schools.com/tags/movie.mp4',
            id: '1_fdsguh765_11311,applehttp'
          }
        ]
      },
      plugins: {
        kanalytics: {
          playerVersion: playerVersion,
          entryId: cm_id,
          playlistId: cm_plId,
          entryType: cm_type,
          sessionId: cm_sId,
          uiConfId: 654321,
          ks: cm_ks,
          partnerId: 2046854,
          referrer: document.URL
        }
      }
    };

    /**
     * @param {Object} event - event
     * @return {void}
     */
    function verifyPayloadProperties(payload) {
      payload.ks.should.equal(cm_ks);
      const event = payload.event;
      event.clientVer.should.equal(playerVersion);
      event.partnerId.should.equal(cm_pId);
      event.widgetId.should.equal('_' + cm_pId);
      event.uiConfId.should.equal(cm_uId);
      event.entryId.should.equal(cm_id);
      event.playlistId.should.equal(cm_plId);
      event.referrer.should.equal(document.URL);
      payload.hasKanalony.should.be.false;
      if (event.duration) {
        event.duration.should.equal(12.612);
      }
    }

    beforeEach(function() {
      sandbox = sinon.createSandbox();
      sendSpy = sandbox.spy(XMLHttpRequest.prototype, 'send');
      player = loadPlayer(config);
      player.ready().then(() => {
        player.play();
      });
      player.load();
    });

    it('should not send widget loaded on change media', done => {
      player.addEventListener(player.Event.CHANGE_SOURCE_STARTED, () => {
        player.addEventListener(player.Event.SOURCE_SELECTED, () => {
          player.ready().then(() => {
            const payload = sendSpy.lastCall.args[0];
            verifyPayloadProperties(payload);
            payload.event.seek.should.be.false;
            payload.event.eventType.should.not.equal(1);
            done();
          });
          player.load();
        });
      });
      player.configure(CMconfig);
    });

    it('should send media loaded', done => {
      player.addEventListener(player.Event.CHANGE_SOURCE_STARTED, () => {
        player.addEventListener(player.Event.SOURCE_SELECTED, () => {
          player.ready().then(() => {
            const payload = sendSpy.lastCall.args[0];
            verifyPayloadProperties(payload);
            payload.event.seek.should.be.false;
            payload.event.eventType.should.equal(2);
            done();
          });
          player.load();
        });
      });
      player.configure(CMconfig);
    });

    it('should send first play', done => {
      player.addEventListener(player.Event.CHANGE_SOURCE_STARTED, () => {
        player.addEventListener(player.Event.SOURCE_SELECTED, () => {
          player.addEventListener(player.Event.FIRST_PLAY, () => {
            const payload = sendSpy.lastCall.args[0];
            verifyPayloadProperties(payload);
            payload.event.seek.should.be.false;
            payload.event.eventType.should.equal(3);
            done();
          });
          player.play();
        });
      });
      player.configure(CMconfig);
    });

    it('seek should be false', done => {
      player.addEventListener(player.Event.CHANGE_SOURCE_STARTED, () => {
        player.addEventListener(player.Event.SOURCE_SELECTED, () => {
          player.addEventListener(player.Event.FIRST_PLAY, () => {
            const payload = sendSpy.lastCall.args[0];
            payload.event.seek.should.be.false;
            done();
          });
          player.play();
        });
      });
      const onSeeked = () => {
        player.removeEventListener(player.Event.SEEKED, onSeeked);
        player.configure(CMconfig);
      };
      player.addEventListener(player.Event.SEEKED, onSeeked);
      player.currentTime = 5;
    });

    it('should not send replay if change media on ended', done => {
      player.addEventListener(player.Event.FIRST_PLAY, () => {
        player.currentTime = player.duration - 1;
      });
      player.addEventListener(player.Event.ENDED, () => {
        player.addEventListener(player.Event.LOADED_METADATA, () => {
          player.addEventListener(player.Event.PLAY, () => {
            const payload = sendSpy.getCall(10).args[0];
            payload.event.eventType.should.not.equal(16);
            done();
          });
          player.play();
        });
        player.configure(CMconfig);
        player.load();
      });
    });

    it('should send 25% - 100% again while change media ', done => {
      player.addEventListener(player.Event.CHANGE_SOURCE_STARTED, () => {
        player.addEventListener(player.Event.SOURCE_SELECTED, () => {
          player.addEventListener(player.Event.LOADED_METADATA, () => {
            const onTimeUpdate = () => {
              player.removeEventListener(player.Event.TIME_UPDATE, onTimeUpdate);
              const payload25 = sendSpy.getCall(8).args[0];
              const payload50 = sendSpy.getCall(9).args[0];
              const payload75 = sendSpy.getCall(10).args[0];
              const payload100 = sendSpy.getCall(11).args[0];
              payload25.event.eventType.should.equal(4);
              payload50.event.eventType.should.equal(5);
              payload75.event.eventType.should.equal(6);
              payload100.event.eventType.should.equal(7);
              verifyPayloadProperties(payload25);
              done();
            };
            player.addEventListener(player.Event.TIME_UPDATE, onTimeUpdate);
            player.getVideoElement().currentTime = 12.7;
          });
          player.load();
        });
      });

      player.addEventListener(player.Event.FIRST_PLAY, () => {
        const onEnded = () => {
          player.removeEventListener(player.Event.TIME_UPDATE, onEnded);
          player.configure(CMconfig);
        };
        player.addEventListener(player.Event.TIME_UPDATE, onEnded);
        player.currentTime = player.duration - 1;
      });
    });
  });

  describe('handle missing params', function() {
    beforeEach(function() {
      sandbox = sinon.createSandbox();
      sendSpy = sandbox.spy(XMLHttpRequest.prototype, 'send');
    });
    it('should not send report if partner id is missing', done => {
      config.plugins.kanalytics.partnerId = '';
      player = loadPlayer(config);
      player.ready().then(() => {
        sendSpy.callCount.should.equal(0);
        done();
      });
      player.load();
    });

    it('should not send report if entry id is missing', done => {
      config.plugins.kanalytics.entryId = '';
      player = loadPlayer(config);
      player.ready().then(() => {
        sendSpy.callCount.should.equal(0);
        done();
      });
      player.load();
    });
  });
});

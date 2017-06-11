//eslint-disable-next-line no-unused-vars
import kanalytics from '../../src/kanalytics.js'
import playkit from 'playkit-js'

describe('KanalyticsPlugin', function () {
  this.timeout(4000);

  it('should play mp4 stream while reporting kaltura analytics', (done) => {
    let player = playkit({
      "id": "1_khtjop5s",
      "ks": "djJ8MjIzMTYzMXzfg-251txtImBoxavZnydxwlnmb7Urpy8wgCxAYp3Q-r-Bvr_WUWv1tfHe04sbBRTVvmVSan96RZAHUURnYXZ_7tyoIgWiASHM-mmDRyv4SmHdnVkSGyFXU2ApmK6GRhuTJrf_LqkkWgl3aVgmL8Rw",
      "partnerID":2231631,
      "uiConfID": 39358152,
      'sources': [{
        "mimetype": "video/mp4",
        "url": "http://dev-backend31.dev.kaltura.com/p/108/sp/10800/playManifest/entryId/0_ugkcuhnm/protocol/http/format/url/falvorIds/0_iju04laq,0_2mhxl42h,0_gs5s2yr8,0_6iaetiz6,0_aom26ee8/ks/MDZlMmE0NTNmOTY4NWZiYTg1NTY3OWVhNDgzNDI0ZmEyMTc3ZDQ1Y3wxMDg7MTA4OzE0OTY5ODE2MDk7MDsxNDk2ODk1MjA5Ljc2MzE7MDt2aWV3Oiosd2lkZ2V0OjE7Ow==/a.mp4?uiConfId=.23448262",
        "id": "0_ugkcuhnm_2,url"
      }],
      'plugins': {
        'kanalytics': {

        }
      }
    });
    let video = document.getElementsByTagName("video")[0];
    /*video.onplaying = function () {
     player.destroy();
     done();
     };
     player.load();*/
    player.play();
  });
});

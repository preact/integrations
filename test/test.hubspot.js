var auth         = require('./auth')
  , facade       = require('segmentio-facade')
  , format       = require('util').format
  , helpers      = require('./helpers')
  , integrations = require('..')
  , should       = require('should')
  , uid          = require('uid');


var hubspot  = new integrations['HubSpot']()
  , settings = auth['HubSpot'];


describe('HubSpot', function () {

  describe('.enabled()', function () {

    it('should only be enabled for server side messages', function () {
      hubspot.enabled(new facade.Track({
        channel : 'server',
        userId  : 'calvin@segment.io'
      })).should.be.ok;

      hubspot.enabled(new facade.Track({
        userId  : 'calvin@segment.io',
        channel : 'client'
      })).should.not.be.ok;
    });

    it('should not be enabled without an email', function () {
      should.not.exist(hubspot.enabled(new facade.Track({
        channel : 'server'
      })));

      should.exist(hubspot.enabled(new facade.Track({
        channel : 'server',
        userId  : 'calvin@segment.io'
      })));
    });
  });


  describe('.validate()', function () {
    var identify = helpers.identify();

    it('should not validate settings without a portalId', function () {
      hubspot.validate(identify, {}).should.be.instanceOf(Error);
      hubspot.validate(identify, { apiKey : 'x' }).should.be.instanceOf(Error);
    });

    it('should not validate messages without an apiKey', function () {
      hubspot.validate(identify, { portalId : 'x' }).should.be.instanceOf(Error);
    });

    it('should validate proper identify calls', function () {
      should.not.exist(hubspot.validate(identify, { apiKey : 'x', portalId : 'y' }));
    });
  });


  describe('.identify()', function () {
    var identify = helpers.identify();

    it('should identify successfully', function (done) {
      hubspot.identify(identify, settings, done);
    });

    it('should identify a second time', function (done) {
      hubspot.identify(identify, settings, done);
    });

    it('should identify with "date" objects', function (done) {
      // the hubspot demo key has this as the only "date" type
      var identify = helpers.identify({
        traits: {
          offerextractdate: new Date()
        }
      });
      hubspot.identify(identify, settings, done);
    });
  });

  describe('._create()', function () {
    var email = format('test-%s@segment.io', uid());
    var properties = [{ property: 'email', value: email }];

    it('should be able to ._create() once', function (done) {
      hubspot._create(properties, settings, done);
    });

    it('should be able to ._update() on the second call', function (done) {
      hubspot._create(properties, settings, done);
    });
  });


  describe('.track()', function () {
    var track = helpers.track();

    it('should track successfully', function (done) {
      hubspot.track(track, settings, done);
    });
  });


  describe('.alias()', function () {
    var alias = helpers.alias();

    it('should do nothing', function (done) {
      hubspot.alias(alias, settings, done);
    });
  });
});

(function (QUnit, Infusion) {
    QUnit.module('Unit');
    QUnit.test('Service tests', function (assert) {
        var c = new Infusion();

        c.set('function', function (container) {
            return 'baz';
        });
        assert.equal(c.get('function'), 'baz', 'Function values are evaluated when retrieved');

        c.set('container-argument', function (container) {
            return container;
        });
        assert.deepEqual(c.get('container-argument'), c, 'Services receive the container as first argument');

        c.set('string', 'troz');
        c.set('service-with-dependencies', function (foo, bar) {
            return foo + ' ' + bar;
        }, ['function', 'string']);
        assert.equal(c.get('service-with-dependencies'), 'baz troz', 'Services registered with dependencies receive deps instead of container as arguments');

        c.set('service-with-container-sub', function (string, container) {
            return container;
        }, ['string', 'container-argument']);
        assert.deepEqual(c.get('service-with-container-sub'), c, 'Service dependencies still receive container as argument');

        c.set('parent-service', function (string) {
            return string;
        }, ['string']);

        c.set('dependent-service', function (parent, string) {
            return parent + ' ' + string;
        }, ['parent-service', 'string']);

        assert.equal(c.get('dependent-service'), 'troz troz', 'Dependencies are resolved down the chain');

        c.set('nonsense-service', function (nonsense) {
            return nonsense;
        }, ['nonsense-parameter']);
        assert.throws(function () {
            c.get('nonsense-service');
        }, /Dependency "nonsense-parameter" of service "nonsense-service" does not exist\./, 'Service with nonexistent dependency should throw');

        c.set('nonsense-parameter', 'foo');
        assert.equal(c.get('nonsense-service'), 'foo', 'If dependencies are set, service should no longer throw');

        c.set('function-dep-service', function (foo) {
            return foo();
        }, [function () {
            return 'i am a function';
        }]);
        assert.equal(c.get('function-dep-service'), 'i am a function', 'Registered services should receive function dependencies without modification');

        var Foo = function () {
            this.x = 0;
        };
        Foo.prototype.increment = function () {
            return ++this.x;
        };

        c.set('referenced', c.reference(function () {
            return new Foo();
        }));
        assert.equal(c.get('referenced').increment(), 1, 'Infusion#reference should return the referenced value');
        assert.equal(c.get('referenced').increment(), 2, 'Additional calls to Infusion#reference should refer to the original object');
    });
}(QUnit, Infusion));

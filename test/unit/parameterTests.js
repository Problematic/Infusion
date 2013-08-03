(function (QUnit, Infusion) {
    QUnit.module('Unit');
    QUnit.test('Parameter tests', function (assert) {
        var c = new Infusion();

        c.set('string', 'foo');
        assert.equal(c.get('string'), 'foo', 'Strings are set as parameters');

        assert.strictEqual(c.has('string'), true, 'Infusion#has should return true for values that have been set');
        assert.strictEqual(c.has('somestring'), false, 'Infusion#has should return false for values that have not been set');

        c.set('integer', 5);
        assert.equal(c.get('integer'), 5, 'Integers are set as parameters');

        var insulated = function () {
            return 'I am insulated';
        };
        c.set('insulated', c.insulate(insulated));
        assert.equal(c.get('insulated'), insulated, 'Infusion#insulate should store a function as a parameter');
    });
}(QUnit, Infusion));

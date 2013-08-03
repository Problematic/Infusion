var Infusion = (function () {
    var Infusion = function () {
        if (!(this instanceof Infusion)) {
            return new Infusion();
        }

        this.values = {};
        this.services = {};
    };

    Infusion.prototype.set = function (key, value, dependencies) {
        this.values[key] = value;
        if (dependencies instanceof Array) {
            this.services[key] = {
                dependencies: dependencies
            };
        }
    };

    Infusion.prototype.has = function (key) {
        return this.values[key] !== undefined;
    };

    Infusion.prototype.get = function (key) {
        var value = this.values[key],
            service = this.services[key],
            dependencies,
            dependency;

        if (value === undefined) {
            throw new ReferenceError('Service or parameter "' + key + '" does not exist.');
        }

        if (service !== undefined) {
            dependencies = service.dependencies;
            for (var i = 0; i < dependencies.length; i++) {
                dependency = dependencies[i];
                if (typeof dependency === 'string') {
                    try {
                        dependencies[i] = this.get(dependency);
                    } catch (e) {
                        if (e instanceof ReferenceError) {
                            e.message = 'Dependency "' + dependency + '" of service "' + key + '" does not exist.';
                        }
                        throw e;
                    }
                }
            }
            return value.apply(value, dependencies);
        }

        return typeof value === 'function' ? value(this) : value;
    };

    Infusion.prototype.insulate = function (value) {
        return function (container) {
            return value;
        };
    };

    Infusion.prototype.reference = function (value) {
        var object = null;
        return function (container) {
            if (object === null) {
                object = value(container);
            }

            return object;
        };
    };

    return Infusion;
}());

function HardMan(name) {
    let tasks = [];
    let next = function () {
        if (tasks.length) {
            (tasks.shift())();
        }
    }
    let sleep = function (time) {
        return function () {
            setTimeout(() => {
                console.log(`等待${time}秒`);
                console.log(`Start learning after ${time} seconds`);
                next();
            }, time * 1000);
        };
    }
    let fn = function() {};
    fn.prototype.rest = function(time) {
        tasks.push(sleep(time));
        return this;
    }
    fn.prototype.restFirst = function(time) {
        tasks.unshift(sleep(time));
        return this;
    }
    fn.prototype.learn = function(subject) {
        tasks.push(() => { console.log(`Learning ${subject}`); next()});
        return this;
    }
    // fn.prototype.name = function(name) {
    //     tasks.push(() => { console.log(`I am ${name}`); next()});
    //     return this;
    // }

    tasks.push(() => { console.log(`I am ${name}`); next()});

    setTimeout(next, 0);
    // let obj = new fn();

    // return obj.name(name);
    return new fn();
}

HardMan("jack").rest(1).restFirst(2).learn("chinese");

function HardMan1(name) {
    var tasks = [];
    var after = 0;
    var next = function () {
        if (tasks.length) (tasks.shift())();
    };
    var sleep = function (time) {
        return function () {
            setTimeout(function () {
                after += time;
                console.log(`Start learning after ${after} second`);
                next();
            }, time * 1000);
        };
    };
    var fn = function () { };

    fn.prototype.rest = function (time) {
        tasks.push(sleep(time));
        return this;
    };
    fn.prototype.restFirst = function (time) {
        tasks.unshift(sleep(time));
        return this;
    };
    fn.prototype.learn = function (subject) {
        tasks.push(function () {
            console.log(`Learning ${subject}`);
            after = 0;
            next();
        });
        return this;
    };

    tasks.push(function () {
        console.log(`I am ${name}`);
        after = 0;
        next();
    });

    setTimeout(next, 0);

    return new fn();
}
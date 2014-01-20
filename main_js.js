(function() {
  var Rectangle, Thang, Vector, cube1, cube2, cube3, cube4, log, sphere1,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    __slice = [].slice;

  Vector = (function() {
    var name, _fn, _i, _len, _ref;

    _ref = ['add', 'subtract', 'multiply', 'divide'];
    _fn = function(name) {
      return Vector[name] = function(a, b, useZ) {
        return a.copy()[name](b, useZ);
      };
    };
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      name = _ref[_i];
      _fn(name);
    }

    Vector.prototype.isVector = true;

    function Vector(x, y, z) {
      this.x = x != null ? x : 0;
      this.y = y != null ? y : 0;
      this.z = z != null ? z : 0;
    }

    Vector.prototype.copy = function() {
      return new Vector(this.x, this.y, this.z);
    };

    Vector.prototype.magnitude = function(useZ) {
      var sum;
      sum = this.x * this.x + this.y * this.y;
      if (useZ) {
        sum += this.z * this.z;
      }
      return Math.sqrt(sum);
    };

    Vector.prototype.magnitudeSquared = function(useZ) {
      var sum;
      sum = this.x * this.x + this.y * this.y;
      if (useZ) {
        sum += this.z * this.z;
      }
      return sum;
    };

    Vector.prototype.normalize = function(useZ) {
      var m;
      m = this.magnitude(useZ);
      if (m > 0) {
        this.divide(m, useZ);
      }
      return this;
    };

    Vector.prototype.limit = function(max) {
      if (this.magnitude() > max) {
        this.normalize();
        return this.multiply(max);
      } else {
        return this;
      }
    };

    Vector.prototype.heading = function() {
      return -1 * Math.atan2(-1 * this.y, this.x);
    };

    Vector.prototype.distance = function(other, useZ) {
      var dx, dy, dz, sum;
      dx = this.x - other.x;
      dy = this.y - other.y;
      sum = dx * dx + dy * dy;
      if (useZ) {
        dz = this.z - other.z;
        sum += dz * dz;
      }
      return Math.sqrt(sum);
    };

    Vector.prototype.distanceSquared = function(other, useZ) {
      var dx, dy, dz, sum;
      dx = this.x - other.x;
      dy = this.y - other.y;
      sum = dx * dx + dy * dy;
      if (useZ) {
        dz = this.z - other.z;
        sum += dz * dz;
      }
      return sum;
    };

    Vector.prototype.subtract = function(other, useZ) {
      this.x -= other.x;
      this.y -= other.y;
      if (useZ) {
        this.z -= other.z;
      }
      return this;
    };

    Vector.prototype.add = function(other, useZ) {
      this.x += other.x;
      this.y += other.y;
      if (useZ) {
        this.z += other.z;
      }
      return this;
    };

    Vector.prototype.divide = function(n, useZ) {
      var _ref1;
      _ref1 = [this.x / n, this.y / n], this.x = _ref1[0], this.y = _ref1[1];
      if (useZ) {
        this.z = this.z / n;
      }
      return this;
    };

    Vector.prototype.multiply = function(n, useZ) {
      var _ref1;
      _ref1 = [this.x * n, this.y * n], this.x = _ref1[0], this.y = _ref1[1];
      if (useZ) {
        this.z = this.z * n;
      }
      return this;
    };

    Vector.prototype.dot = function(other, useZ) {
      var sum;
      sum = this.x * other.x + this.y * other.y;
      if (useZ) {
        sum += this.z + other.z;
      }
      return sum;
    };

    Vector.prototype.projectOnto = function(other, useZ) {
      return other.copy().multiply(this.dot(other, useZ), useZ);
    };

    Vector.prototype.isZero = function(useZ) {
      var result;
      result = this.x === 0 && this.y === 0;
      if (useZ) {
        result = result && this.z === 0;
      }
      return result;
    };

    Vector.prototype.equals = function(other, useZ) {
      var result;
      result = other && this.x === other.x && this.y === other.y;
      if (useZ) {
        result = result && this.z === other.z;
      }
      return result;
    };

    Vector.prototype.rotate = function(theta) {
      var _ref1;
      if (!theta) {
        return this;
      }
      _ref1 = [Math.cos(theta) * this.x - Math.sin(theta) * this.y, Math.sin(theta) * this.x + Math.cos(theta) * this.y], this.x = _ref1[0], this.y = _ref1[1];
      return this;
    };

    Vector.prototype.invalid = function() {
      return (this.x === Infinity) || isNaN(this.x) || this.y === Infinity || isNaN(this.y) || this.z === Infinity || isNaN(this.z);
    };

    Vector.prototype.toString = function(useZ) {
      useZ = true;
      if (useZ) {
        return "{x: " + (this.x.toFixed(0)) + ", y: " + (this.y.toFixed(0)) + ", z: " + (this.z.toFixed(0)) + "}";
      }
      return "{x: " + (this.x.toFixed(0)) + ", y: " + (this.y.toFixed(0)) + "}";
    };

    return Vector;

  })();

  Rectangle = (function() {
    var name, _fn, _i, _len, _ref;

    Rectangle.className = "Rectangle";

    _ref = ['add', 'subtract', 'multiply', 'divide'];
    _fn = function(name) {
      return Rectangle[name] = function(a, b) {
        return a.copy()[name](b);
      };
    };
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      name = _ref[_i];
      _fn(name);
    }

    function Rectangle(x, y, width, height, rotation) {
      this.x = x != null ? x : 0;
      this.y = y != null ? y : 0;
      this.width = width != null ? width : 0;
      this.height = height != null ? height : 0;
      this.rotation = rotation != null ? rotation : 0;
    }

    Rectangle.prototype.copy = function() {
      return new Rectangle(this.x, this.y, this.width, this.height, this.rotation);
    };

    Rectangle.prototype.getPos = function() {
      return new Vector(this.x, this.y);
    };

    Rectangle.prototype.vertices = function() {
      var cos, h2, sin, w2, _ref1;
      _ref1 = [this.width / 2, this.height / 2, Math.cos(this.rotation), Math.sin(-this.rotation)], w2 = _ref1[0], h2 = _ref1[1], cos = _ref1[2], sin = _ref1[3];
      return [new Vector(this.x - (w2 * cos - h2 * sin), this.y - (w2 * sin + h2 * cos)), new Vector(this.x - (w2 * cos + h2 * sin), this.y - (w2 * sin - h2 * cos)), new Vector(this.x + (w2 * cos - h2 * sin), this.y + (w2 * sin + h2 * cos)), new Vector(this.x + (w2 * cos + h2 * sin), this.y + (w2 * sin - h2 * cos))];
    };

    Rectangle.prototype.touchesRect = function(other) {
      var bl1, bl2, br1, br2, tl1, tl2, tr1, tr2, _ref1, _ref2;
      _ref1 = this.vertices(), bl1 = _ref1[0], tl1 = _ref1[1], tr1 = _ref1[2], br1 = _ref1[3];
      _ref2 = other.vertices(), bl2 = _ref2[0], tl2 = _ref2[1], tr2 = _ref2[2], br2 = _ref2[3];
      if (tl1.x > tr2.x || tl2.x > tr1.x) {
        return false;
      }
      if (bl1.y > tl2.y || bl2.y > tl1.y) {
        return false;
      }
      if (tl1.x === tr2.x || tl2.x === tr1.x) {
        return true;
      }
      if (tl1.y === bl2.y || tl2.y === bl1.y) {
        return true;
      }
      return false;
    };

    Rectangle.prototype.touchesPoint = function(p) {
      var bl, br, tl, tr, _ref1;
      _ref1 = this.vertices(), bl = _ref1[0], tl = _ref1[1], tr = _ref1[2], br = _ref1[3];
      if (!(p.y >= bl.y && p.y <= tl.y)) {
        return false;
      }
      if (!(p.x >= bl.x && p.x <= br.x)) {
        return false;
      }
      if (p.x === bl.x || p.x === br.x) {
        return true;
      }
      if (p.y === bl.y || p.y === tl.y) {
        return true;
      }
      return false;
    };

    Rectangle.prototype.axisAlignedBoundingBox = function(rounded) {
      var box, left, top, vertex, _j, _len1, _ref1, _ref2, _ref3, _ref4, _ref5;
      if (rounded == null) {
        rounded = true;
      }
      box = this.copy();
      if (!this.rotation) {
        return box;
      }
      box.rotation = 0;
      _ref1 = [9001, 9001], left = _ref1[0], top = _ref1[1];
      _ref2 = this.vertices();
      for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
        vertex = _ref2[_j];
        _ref3 = [Math.min(left, vertex.x), Math.min(top, vertex.y)], left = _ref3[0], top = _ref3[1];
      }
      if (rounded) {
        _ref4 = [Math.round(left), Math.round(top)], left = _ref4[0], top = _ref4[1];
      }
      _ref5 = [2 * (this.x - left), 2 * (this.y - top)], box.width = _ref5[0], box.height = _ref5[1];
      return box;
    };

    Rectangle.prototype.distanceToPoint = function(p) {
      var dx, dy;
      p = Vector.subtract(p, this.getPos()).rotate(-this.rotation);
      dx = Math.max(Math.abs(p.x) - this.width / 2, 0);
      dy = Math.max(Math.abs(p.y) - this.height / 2, 0);
      return Math.sqrt(dx * dx + dy * dy);
    };

    Rectangle.prototype.distanceFromEdgeToPoint = function(p) {
      var a, bl1, br1, distanceFromCenterToEdge, ix, iy, theta, thetaMag, tl1, tr1, v1, x, _ref1;
      v1 = Vector.subtract(p, this.getPos()).rotate(-this.rotation);
      a = v1.y / v1.x;
      theta = Math.atan2(v1.y, v1.x);
      _ref1 = (function() {
        var _j, _len1, _ref1, _results;
        _ref1 = this.vertices();
        _results = [];
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          x = _ref1[_j];
          _results.push(x.subtract(this.getPos()));
        }
        return _results;
      }).call(this), bl1 = _ref1[0], tl1 = _ref1[1], tr1 = _ref1[2], br1 = _ref1[3];
      thetaMag = Math.abs(theta);
      if (thetaMag <= Math.PI / 4) {
        ix = tr1.x;
        iy = ix * a;
      } else if (thetaMag <= 3 * Math.PI / 4) {
        if (theta > 0) {
          iy = tr1.y;
          ix = iy / a;
        } else {
          iy = br1.y;
          ix = iy / a;
        }
      } else {
        ix = tl1.xiy = ix * a;
      }
      distanceFromCenterToEdge = Math.sqrt(ix * ix + iy * iy);
      return v1.magnitude() - distanceFromCenterToEdge;
    };

    Rectangle.prototype.distanceSquaredToPoint = function(p) {
      var dx, dy;
      dx = Math.max(Math.abs(p.x) - this.width / 2, 0);
      dy = Math.max(Math.abs(p.y) - this.height / 2, 0);
      return dx * dx + dy * dy;
    };

    Rectangle.prototype.containsPoint = function(p, withRotation) {
      var _ref1, _ref2;
      if (withRotation == null) {
        withRotation = true;
      }
      if (withRotation && this.rotation) {
        return !this.distanceToPoint(p);
      } else {
        return (this.x - this.width / 2 < (_ref1 = p.x) && _ref1 < this.x + this.width / 2) && (this.y - this.height / 2 < (_ref2 = p.y) && _ref2 < this.y + this.height / 2);
      }
    };

    Rectangle.prototype.subtract = function(point) {
      this.x -= point.x;
      this.y -= point.y;
      this.pos.subtract(point);
      return this;
    };

    Rectangle.prototype.add = function(point) {
      this.x += point.x;
      this.y += point.y;
      this.pos.add(point);
      return this;
    };

    Rectangle.prototype.divide = function(n) {
      var _ref1;
      _ref1 = [this.width / n, this.height / n], this.width = _ref1[0], this.height = _ref1[1];
      return this;
    };

    Rectangle.prototype.multiply = function(n) {
      var _ref1;
      _ref1 = [this.width * n, this.height * n], this.width = _ref1[0], this.height = _ref1[1];
      return this;
    };

    Rectangle.prototype.isEmpty = function() {
      return this.width === 0 && this.height === 0;
    };

    Rectangle.prototype.invalid = function() {
      return (this.x === Infinity) || isNaN(this.x) || this.y === Infinity || isNaN(this.y) || this.width === Infinity || isNaN(this.width) || this.height === Infinity || isNaN(this.height) || this.rotation === Infinity || isNaN(this.rotation);
    };

    Rectangle.prototype.toString = function() {
      return "{x: " + (this.x.toFixed(0)) + ", y: " + (this.y.toFixed(0)) + ", w: " + (this.width.toFixed(0)) + ", h: " + (this.height.toFixed(0)) + ", rot: " + (this.rotation.toFixed(3)) + "}";
    };

    return Rectangle;

  })();

  Thang = (function() {
    function Thang(pos, width, height, depth, shape, rotation) {
      var _ref, _ref1, _ref2, _ref3;
      this.pos = pos;
      this.width = width != null ? width : 1;
      this.height = height != null ? height : 1;
      this.depth = depth != null ? depth : 1;
      this.shape = shape != null ? shape : "box";
      this.rotation = rotation != null ? rotation : 0;
      if (!((_ref = this.pos) != null ? _ref.isVector : void 0)) {
        this.pos = new Vector(((_ref1 = this.pos) != null ? _ref1.x : void 0) || 0, ((_ref2 = this.pos) != null ? _ref2.y : void 0) || 0, ((_ref3 = this.pos) != null ? _ref3.z : void 0) || this.depth / 2);
      }
    }

    Thang.prototype.rectangle = function() {
      return new Rectangle(this.pos.x, this.pos.y, this.width, this.height, this.rotation);
    };

    Thang.prototype.isGrounded = function() {
      return this.pos.z <= this.depth / 2;
    };

    Thang.prototype.isAirborne = function() {
      return this.pos.z > this.depth / 2;
    };

    Thang.prototype.contains = function(thang) {
      var _ref;
      if (false && ((_ref = this.shape) === "ellipsoid" || _ref === "disc")) {

      } else {
        return this.rectangle().containsPoint(thang.pos);
      }
    };

    Thang.prototype.distance = function(thang) {
      if (thang.isVector) {
        return this.pos.distance(thang);
      }
      if (thang.shape === "circle" && this.shape === "box") {
        return this.rectangle().distanceFromEdgeToPoint(thang.pos) - thang.width / 2;
      } else if (thang.shape === "box" && this.shape === "box") {
        return this.rectangle().distanceFromEdgeToPoint(thang.pos) + thang.rectangle().distanceFromEdgeToPoint(this.pos) - this.pos.distance(thang.pos);
      } else {
        return this.pos.distance(thang.pos);
      }
    };

    Thang.prototype.distanceSquared = function(thang) {
      if (thang.isVector) {
        return this.pos.distanceSquared(thang);
      }
      return this.pos.distanceSquared(thang.pos);
    };

    Thang.prototype.intersects = function(thang, t1) {
      var diff, elliptical, r2, rectangular, t1h, t1major, t1r, t1w, t2, t2h, t2major, t2r, t2w, theta, _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9;
      if (t1 == null) {
        t1 = null;
      }
      _ref = [["ellipsoid", "disc"], ["box", "sheet"]], elliptical = _ref[0], rectangular = _ref[1];
      if (t1 == null) {
        t1 = this;
      }
      t2 = thang;
      if ((_ref1 = t2.shape, __indexOf.call(elliptical, _ref1) >= 0) && (_ref2 = t1.shape, __indexOf.call(rectangular, _ref2) >= 0)) {
        _ref3 = [t2, t1], t1 = _ref3[0], t2 = _ref3[1];
      }
      if ((_ref4 = t1.shape, __indexOf.call(elliptical, _ref4) >= 0) || true) {
        diff = Vector.subtract(t2.pos, t1.pos);
        _ref5 = [Math.max(t1.width, t1.height), Math.max(t2.width, t2.height)], t1major = _ref5[0], t2major = _ref5[1];
        if (diff.magnitudeSquared() > (t1major * t1major + t2major * t2major) / 4) {
          return false;
        }
        theta = diff.heading();
        t1r = Math.abs(Math.PI / 2 - Math.abs(Math.PI / 2 - t1.rotation) % Math.PI);
        t1w = Math.cos(t1r) * t1.width + Math.sin(t1r) * t1.height;
        t1h = Math.sin(t1r) * t1.width + Math.cos(t1r) * (t1.heightr1 = new Vector(t1w / 2 * Math.cos(theta), t1h / 2 * Math.sin(theta)));
        if (_ref6 = t2.shape, __indexOf.call(elliptical, _ref6) >= 0) {
          t2r = Math.abs(Math.PI / 2 - Math.abs(Math.PI / 2 - t2.rotation) % Math.PI);
          t2w = Math.cos(t2r) * t2.width + Math.sin(t2r) * t2.height;
          t2h = Math.sin(t2r) * t2.width + Math.cos(t2r) * t2.height;
          r2 = new Vector(t2w / 2 * -Math.cos(theta), t2h / 2 * -Math.sin(theta));
          return r1.magnitude() + r2.magnitude() >= diff.magnitude();
        } else if (_ref7 = t2.shape, __indexOf.call(rectangular, _ref7) >= 0) {
          if (r1.magnitude() > diff.magnitude()) {
            return true;
          } else if (t2.rectangle().containsPoint(Vector.add(t1.pos, r1))) {
            return true;
          } else {
            return false;
          }
        }
      } else if ((_ref8 = t1.shape, __indexOf.call(rectangular, _ref8) >= 0) && (_ref9 = t2.shape, __indexOf.call(rectangular, _ref9) >= 0)) {
        return this.contains(thang);
      }
    };

    Thang.prototype.toString = function() {
      return "<" + this.shape + " - " + (this.pos.toString()) + " - " + this.width + " x " + this.height + " x " + this.depth;
    };

    return Thang;

  })();

  log = function() {
    var args;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return $('#output').append($('<div></div>').text(args.join(' ')));
  };

  cube1 = new Thang({
    x: 2,
    y: 2
  }, 4, 4, 4, "box");

  cube2 = new Thang({
    x: 5,
    y: 5
  }, 2, 2, 2, "box");

  sphere1 = new Thang({
    x: 7,
    y: 7
  }, 1, 1, 1, "circle");

  cube3 = new Thang({
    x: 0,
    y: 0
  }, 1, 1, 1, "box");

  cube4 = new Thang({
    x: 2,
    y: 2
  }, 1, 1, 1, "box");

  log("cube1", cube1);

  log("cube2", cube2);

  log("sphere1", sphere1);

  log("cube3", cube3);

  log("cube4", cube4);

  log("cube1 to cube2 distance is", cube1.distance(cube2).toFixed(4), "should be 0 since corners touch");

  log("cube3 to cube4 distance is", cube3.distance(cube4).toFixed(4), "should be sqrt(2)=~1.414");

  log("cube2 to sphere1 distance is", cube2.distance(sphere1), "should be sqrt(2) - 1/2 =~0.914 since that's how far circle edge should be from cube edge at 6, 6");

}).call(this);

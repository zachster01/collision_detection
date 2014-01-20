# https://github.com/hornairs/blog/blob/master/assets/coffeescripts/flocking/vector.coffee
class Vector
  # Class methods for nondestructively operating
  for name in ['add', 'subtract', 'multiply', 'divide']
    do (name) ->
      Vector[name] = (a, b, useZ) ->
        a.copy()[name](b, useZ)

  isVector: true

  constructor: (@x=0, @y=0, @z=0) ->

  copy: ->
    new Vector(@x, @y, @z)

  magnitude: (useZ) ->
    sum = @x * @x + @y * @y
    sum += @z * @z if useZ
    Math.sqrt sum

  magnitudeSquared: (useZ) ->
    sum = @x * @x + @y * @y
    sum += @z * @z if useZ
    sum

  normalize: (useZ) ->
    m = @magnitude useZ
    @divide m, useZ if m > 0
    @

  limit: (max) ->
    if @magnitude() > max
      @normalize()
      return @multiply(max)
    else
      @

  heading: ->
    -1 * Math.atan2(-1 * @y, @x)

  distance: (other, useZ) ->
    dx = @x - other.x
    dy = @y - other.y
    sum = dx * dx + dy * dy
    if useZ
      dz = @z - other.z
      sum += dz * dz
    Math.sqrt sum

  distanceSquared: (other, useZ) ->
    dx = @x - other.x
    dy = @y - other.y
    sum = dx * dx + dy * dy
    if useZ
      dz = @z - other.z
      sum += dz * dz
    sum

  subtract: (other, useZ) ->
    @x -= other.x
    @y -= other.y
    @z -= other.z if useZ
    @

  add: (other, useZ) ->
    @x += other.x
    @y += other.y
    @z += other.z if useZ
    @

  divide: (n, useZ) ->
    [@x, @y] = [@x / n, @y / n]
    @z = @z / n if useZ
    @

  multiply: (n, useZ) ->
    [@x, @y] = [@x * n, @y * n]
    @z = @z * n if useZ
    @

  dot: (other, useZ) ->
    sum = @x * other.x + @y * other.y
    sum += @z + other.z if useZ
    sum

  # Not the strict projection, the other isn't converted to a unit vector first.
  projectOnto: (other, useZ) ->
    other.copy().multiply(@dot(other, useZ), useZ)

  isZero: (useZ) ->
    result = @x is 0 and @y is 0
    result = result and @z is 0 if useZ
    result

  equals: (other, useZ) ->
    result = other and @x is other.x and @y is other.y
    result = result and @z is other.z if useZ
    result

  # Rotate it around the origin
  # If we ever want to make this also use z: https://en.wikipedia.org/wiki/Axes_conventions
  rotate: (theta) ->
    return @ unless theta
    [@x, @y] = [Math.cos(theta) * @x - Math.sin(theta) * @y, Math.sin(theta) * @x + Math.cos(theta) * @y]
    @

  invalid: () ->
    return (@x is Infinity) || isNaN(@x) || @y is Infinity || isNaN(@y) || @z is Infinity || isNaN(@z)

  toString: (useZ) ->
    useZ = true
    return "{x: #{@x.toFixed(0)}, y: #{@y.toFixed(0)}, z: #{@z.toFixed(0)}}" if useZ
    return "{x: #{@x.toFixed(0)}, y: #{@y.toFixed(0)}}"


    
class Rectangle
  @className: "Rectangle"
  # Class methods for nondestructively operating
  for name in ['add', 'subtract', 'multiply', 'divide']
    do (name) ->
      Rectangle[name] = (a, b) ->
        a.copy()[name](b)

  constructor: (@x=0, @y=0, @width=0, @height=0, @rotation=0) ->

  copy: ->
    new Rectangle(@x, @y, @width, @height, @rotation)

  getPos: ->
    new Vector(@x, @y)

  vertices: ->
    # Counter-clockwise, starting from bottom left (when unrotated)
    [w2, h2, cos, sin] = [@width / 2, @height / 2, Math.cos(@rotation), Math.sin(-@rotation)]
    [
      new Vector @x - (w2 * cos - h2 * sin), @y - (w2 * sin + h2 * cos)
      new Vector @x - (w2 * cos + h2 * sin), @y - (w2 * sin - h2 * cos)
      new Vector @x + (w2 * cos - h2 * sin), @y + (w2 * sin + h2 * cos)
      new Vector @x + (w2 * cos + h2 * sin), @y + (w2 * sin - h2 * cos)
    ]

  touchesRect: (other) ->
    # Whether this rect shares part of any edge with other rect, for non-rotated, non-overlapping rectangles.
    # I think it says kitty-corner rects touch, but I don't think I want that.
    # Float instability might get me, too.
    [bl1, tl1, tr1, br1] = @vertices()
    [bl2, tl2, tr2, br2] = other.vertices()
    return false if tl1.x > tr2.x or tl2.x > tr1.x
    return false if bl1.y > tl2.y or bl2.y > tl1.y
    return true if tl1.x is tr2.x or tl2.x is tr1.x
    return true if tl1.y is bl2.y or tl2.y is bl1.y
    false

  touchesPoint: (p) ->
    # Whether this rect has point p exactly on one of its edges, assuming no rotation.
    [bl, tl, tr, br] = @vertices()
    return false unless p.y >= bl.y and p.y <= tl.y
    return false unless p.x >= bl.x and p.x <= br.x
    return true if p.x is bl.x or p.x is br.x
    return true if p.y is bl.y or p.y is tl.y
    false

  axisAlignedBoundingBox: (rounded=true) ->
    box = @copy()
    return box unless @rotation
    box.rotation = 0
    [left, top] = [9001, 9001]
    for vertex in @vertices()
      [left, top] = [Math.min(left, vertex.x), Math.min(top, vertex.y)]
    if rounded
      [left, top] = [Math.round(left), Math.round(top)]
    [box.width, box.height] = [2 * (@x - left), 2 * (@y - top)]
    box

  distanceToPoint: (p) ->
    # Get p in rect's coordinate space, then operate in one quadrant
    p = Vector.subtract(p, @getPos()).rotate(-@rotation)
    dx = Math.max(Math.abs(p.x) - @width / 2, 0)
    dy = Math.max(Math.abs(p.y) - @height / 2, 0)
    Math.sqrt dx * dx + dy * dy

  distanceFromEdgeToPoint: (p) ->
    # returns minimum distance from point to edge of square
    v1 = Vector.subtract(p, @getPos()).rotate(-@rotation)
    a = v1.y / v1.x
    theta = Math.atan2(v1.y, v1.x)
    [bl1, tl1, tr1, br1] = (x.subtract(@getPos()) for x in @vertices())
    thetaMag = Math.abs(theta)
    if thetaMag <= Math.PI / 4
      # right edge
      ix = tr1.x
      iy = ix * a
    else if thetaMag <= 3 * Math.PI / 4
      if theta > 0
        # top edge
        iy = tr1.y
        ix = iy / a
      else
        # bottom edge
        iy = br1.y
        ix = iy / a
    else
      # left edge
      ix = tl1.xiy = ix * a
    distanceFromCenterToEdge = Math.sqrt(ix * ix + iy * iy)
    return v1.magnitude() - distanceFromCenterToEdge
    
  distanceSquaredToPoint: (p) ->
    # Doesn't handle rotation; just supposed to be faster than distanceToPoint
    dx = Math.max(Math.abs(p.x) - @width / 2, 0)
    dy = Math.max(Math.abs(p.y) - @height / 2, 0)
    dx * dx + dy * dy

  containsPoint: (p, withRotation=true) ->
    if withRotation and @rotation
      not @distanceToPoint(p)
    else
      @x - @width / 2 < p.x < @x + @width / 2 and @y - @height / 2 < p.y < @y + @height / 2

  subtract: (point) ->
    @x -= point.x
    @y -= point.y
    @pos.subtract point
    @

  add: (point) ->
    @x += point.x
    @y += point.y
    @pos.add point
    @

  divide: (n) ->
    [@width, @height] = [@width / n, @height / n]
    @

  multiply: (n) ->
    [@width, @height] = [@width * n, @height * n]
    @

  isEmpty: () ->
    @width == 0 and @height == 0

  invalid: () ->
    return (@x == Infinity) || isNaN(@x) || @y == Infinity || isNaN(@y) || @width == Infinity || isNaN(@width) || @height == Infinity || isNaN(@height) || @rotation == Infinity || isNaN(@rotation)

  toString: ->
    return "{x: #{@x.toFixed(0)}, y: #{@y.toFixed(0)}, w: #{@width.toFixed(0)}, h: #{@height.toFixed(0)}, rot: #{@rotation.toFixed(3)}}"


    
class Thang
  constructor: (@pos, @width=1, @height=1, @depth=1, @shape="box", @rotation=0) ->
    @pos = new Vector(@pos?.x or 0, @pos?.y or 0, @pos?.z or @depth / 2) unless @pos?.isVector

  rectangle: ->
    new Rectangle @pos.x, @pos.y, @width, @height, @rotation

  isGrounded: ->
    @pos.z <= @depth / 2

  isAirborne: ->
    @pos.z > @depth / 2

  contains: (thang) ->
    # Determines whether thang's center is within our bounds.
    if false and @shape in ["ellipsoid", "disc"]
      # TODO: handle when thang @ is not rectangular
    else  # box, rectangle
      @rectangle().containsPoint thang.pos
  
  distance: (thang) ->
    # Determines the distance between the closest edges of @ and thang (0 if touching)# TODO: make this aware of the shapes involved# TODO: do it at all
    # http://uclue.com/?xq=4737
    # http://stackoverflow.com/questions/401847/circle-rectangle-collision-detection-intersection
    # http://www.gamasutra.com/view/feature/131598/advanced_collision_detection_.php?print=1
    if thang.isVector
      return @pos.distance(thang)
    if thang.shape == "circle" and @shape == "box"
      # distance from the edge of a cirlce and a rectangle is just the distance from the center of the circle to the rectangle edge,
      # minus the radius of the circle
      return @rectangle().distanceFromEdgeToPoint(thang.pos) - thang.width / 2
    else if thang.shape == "box" and @shape == "box"
      # To get the distance between two rectangle edges, define d1_2 as distance from center of rectangle 1 to edge of rectangle 2
      # define d2_1 as distance from center of rectangle 2 to edge of rectangle 1
      # define d as distance between centers of both rectangles
      # then distance between edges = d1_2 + d2_1 - d
      return @rectangle().distanceFromEdgeToPoint(thang.pos) + thang.rectangle().distanceFromEdgeToPoint(@pos) - @pos.distance(thang.pos)
    else
      return @pos.distance thang.pos
      
  distanceSquared: (thang) ->
    if thang.isVector
      return @pos.distanceSquared thang
    @pos.distanceSquared thang.pos

  intersects: (thang, t1=null) ->
    # TODO: handle rotation
    [elliptical, rectangular] = [["ellipsoid", "disc"], ["box", "sheet"]]
    t1 ?= @
    t2 = thang
    if t2.shape in elliptical and t1.shape in rectangular
      [t1, t2] = [t2, t1]
    if t1.shape in elliptical or true  # temp, since rect intersects isn't done
      # First, see if we're too far away to even possibly intersect.
      # not quite right: rotated rects might have w/2 * sqrt2 as their longest axis
      diff = Vector.subtract t2.pos, t1.pos
      [t1major, t2major] = [Math.max(t1.width, t1.height), Math.max(t2.width, t2.height)]
      if diff.magnitudeSquared() > (t1major * t1major + t2major * t2major) / 4
        return false

      # Normalize to one quadrant, since we just care about symmetric width and height
      theta = diff.heading()
      t1r = Math.abs(Math.PI / 2 - Math.abs(Math.PI / 2 - t1.rotation) % Math.PI)
      t1w = Math.cos(t1r) * t1.width + Math.sin(t1r) * t1.height
      t1h = Math.sin(t1r) * t1.width + Math.cos(t1r) * t1.heightr1 = new Vector(t1w / 2 * Math.cos(theta), t1h / 2 * Math.sin(theta))
      if t2.shape in elliptical
        t2r = Math.abs(Math.PI / 2 - Math.abs(Math.PI / 2 - t2.rotation) % Math.PI)
        t2w = Math.cos(t2r) * t2.width + Math.sin(t2r) * t2.height
        t2h = Math.sin(t2r) * t2.width + Math.cos(t2r) * t2.height
        r2 = new Vector(t2w / 2 * -Math.cos(theta), t2h / 2 * -Math.sin(theta))
        return r1.magnitude() + r2.magnitude() >= diff.magnitude()
      else if t2.shape in rectangular
        # If intersecting, either the distance between centers is less than the radius,
        # or the point on the edge of the ellipse is in the rectangle.
        if r1.magnitude() > diff.magnitude()
          return true
        else if t2.rectangle().containsPoint Vector.add(t1.pos, r1)
          return true
        else
          return false
    else if t1.shape in rectangular and t2.shape in rectangular
      # TODO -- for now we use the branch above and assume t1 is elliptical
      @contains thang  # temp

  toString: ->
    "<#{@shape} - #{@pos.toString()} - #{@width} x #{@height} x #{@depth}"

      
log = (args...) ->
    $('#output').append($('<div></div>').text(args.join(' ')))

cube1 = new Thang({x: 2, y: 2}, 4, 4, 4, "box")
cube2 = new Thang({x: 5, y: 5}, 2, 2, 2, "box")
sphere1 = new Thang({x: 7, y: 7}, 1, 1, 1, "circle")
cube3 = new Thang({x:0, y: 0}, 1, 1, 1, "box")
cube4 = new Thang({x:2, y:2}, 1,1,1, "box")
log("cube1", cube1)
log("cube2", cube2)
log("sphere1", sphere1)
log("cube3", cube3)
log("cube4", cube4)
log("cube1 to cube2 distance is", cube1.distance(cube2).toFixed(4), "should be 0 since corners touch")
log("cube3 to cube4 distance is", cube3.distance(cube4).toFixed(4), "should be sqrt(2)=~1.414")
log("cube2 to sphere1 distance is", cube2.distance(sphere1), "should be sqrt(2) - 1/2 =~0.914 since that's how far circle edge should be from cube edge at 6, 6")

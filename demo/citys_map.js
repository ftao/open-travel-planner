(function(){

var w = 800,
    h = 400;
var padding = 30;

var LocationPool = function(ele){
    this.ele = ele;
    this.nodes = [];
    this.svg = null;
    this.force = null;
    this.color = d3.scale.category10();
}

LocationPool.prototype = {
    init : function(){
        var nodes = this.nodes;

        var svg = d3.select(this.ele).append("svg:svg")
            .attr("width", w)
            .attr("height", h);
        this.svg = svg;



        var force = d3.layout.force()
            .gravity(0.05)
            .charge(function(d, i) { return i ? 0 : -2000; })
            .nodes(nodes)
            .size([w, h]);
        this.force = force;

        force.on("tick", function(e) {
            var q = d3.geom.quadtree(nodes),
                i = 0,
                n = nodes.length;
            while (++i < n) {
                q.visit(collide(nodes[i]));
            }

            svg.selectAll("g.node")
                .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
        });

        function collide(node) {
            var r = node.radius + 30,
                nx1 = node.x - r,
                nx2 = node.x + r,
                ny1 = node.y - r,
                ny2 = node.y + r;
            return function(quad, x1, y1, x2, y2) {
                if (quad.point && (quad.point !== node)) {
                var x = node.x - quad.point.x,
                    y = node.y - quad.point.y,
                    l = Math.sqrt(x * x + y * y),
                    r = node.radius + quad.point.radius;
                if (l < r) {
                    l = (l - r) / l * .5;
                    node.x -= x *= l;
                    node.y -= y *= l;
                    quad.point.x += x;
                    quad.point.y += y;
                }
                }
                return x1 > nx2
                    || x2 < nx1
                    || y1 > ny2
                    || y2 < ny1;
            };
        }

        this.restart();
    },

    restart : function(){
        var color = this.color;
        var force = this.force;
        var nodes = this.nodes;
        var svg = this.svg;

        var node = svg.selectAll("g.node")
            .data(nodes)
        .enter().append("g")
            .attr("class", "node")
            .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

        node.append("svg:circle")
            .attr("r", function(d) { return d.radius - 2; })
            .style("fill", function(d, i) { 
                if (d.locationType == 'startLocation') {
                    return color(2);
                }
                else {
                    var c = i % 5;
                    if (c == 2) {
                        c = 5;
                    }
                    return color(c);
                }
            });
        node.append("text")
            .attr("dy", ".3em")
            .style("text-anchor", "middle")
            .text(function(d) { return d.city; });
        force.start()

    },

    addCity : function(loc, locationType){
        var node = {"city" : loc, 'x' : 0, 'y' : 100, 'radius' : 30, 'locationType' : locationType};
        if (locationType == "startLocation") {
            node['radius'] = 50;
        }
        this.nodes.push(node)
        this.restart();
    }
}

window.LocationPool = LocationPool;

})();



(function(){

var w = 800,
    h = 60;
    r = 30;

var ScheduleLine = function(ele, citys){
    this.ele = ele;
    var nodes = [];
    $.each(citys, function(i, city){
        var node = {'city' : city}
        node['x'] = r + i * (w - r*2) / citys.length;
        node['y'] = h/2;
        node['radius'] = r;
        node['index'] = i;
        nodes.push(node);
    });
    this.nodes = nodes;

    var links = [];
    $.each(this.nodes, function(i, node){
        if (i > 0){
            links.push({'source' : nodes[i-1], 'target' : nodes[i]});
        }
    });
    this.links = links
    this.svg = null;
    this.color = d3.scale.category10();
}

ScheduleLine.prototype = {
    init : function(){
        var nodes = this.nodes;
        var links = this.links;

        var svg = d3.select(this.ele).append("svg:svg")
            .attr("width", w)
            .attr("height", h);

        svg.append("svg:defs").selectAll("marker")
            .data(["marker-arrow"])
            .enter().append("svg:marker")
                .attr("id", String)
                .attr("viewBox", "0 -5 10 10")
                .attr("refX", 10)
                .attr("refY", 0)
                .attr("markerWidth", 6)
                .attr("markerHeight", 6)
                .attr("orient", "auto")
                .append("svg:path")
                    .attr("d", "M0,-5L10,0L0,5");

        var color = this.color;

        var node = svg.selectAll("g.node")
            .data(nodes)
        .enter().append("g")
            .attr("class", "node")
            .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

        node.append("svg:circle")
            .attr("r", function(d) { return d.radius })
            .style("fill", function(d, i) { 
                if (i == 0 || i == nodes.length -1){
                        return color(2);
                }
                else {
                    return color(1);
                }
            })

        node.append("text")
            .attr("dy", ".3em")
            .style("text-anchor", "middle")
            .text(function(d) { return d.city; });

        var link = svg.selectAll("g.link")
            .data(links)
            .enter().append("g")
                .attr("class", "link");

        link.append('svg:path')
            .attr('d', function(d){
                return 'M' + (d.source.x + d.source.radius) + ',' + d.source.y 
                       + 'L' + (d.target.x - d.source.radius) + ',' + d.target.y;
            })
            .attr("stroke", function(d){ return  "#999"; })
            .attr("marker-end", function(d){ return "url(#marker-arrow)"} )
            ;

        link.append('svg:text')
            .attr("x", function(d){ return (d.source.x + d.target.x)/2 - 5 })
            .attr("y", function(d){ return d.source.y - 5; })
            .attr("class", "shadow")
            .text(function(d) { return String(d.target.index);});

    }
}

window.ScheduleLine = ScheduleLine;

})();

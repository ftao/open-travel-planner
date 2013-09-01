(function(){

var w = 800,
    h = 400;
var padding = 30;

var LocationPool = function(ele){
    this.ele = ele;
    this.nodes = [];
    /*
    this.nodes = [
        {"city" : "上海", "src" : true, "radius" : 50},
        {"city" : "兰州", "radius" : 30},
        {"city" : "敦煌", "radius" : 30},
        {"city" : "西安", "radius" : 30}
    ];
    */
    this.svg = null;
    this.force = null;
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
        var color = d3.scale.category10();
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
                    return color(0);
                }
                else {
                    return color((i % 9) + 1); 
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

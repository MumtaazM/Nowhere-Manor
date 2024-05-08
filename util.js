Array.prototype.parse2D = function () {
    const rows = [];
    for (let i = 0; i < this.length; i += 60) {
      rows.push(this.slice(i, i + 60));
    }
    return rows;
  };
  
  Array.prototype.createObjectsFrom2D = function () {
    const leftwalls = []
    const rightwalls = []
    const obstacles = []
    this.forEach((row, y) => {
      row.forEach((symbol, x) => {
        //check for walls = 1501
        if (symbol == 1501) {
          // //push col obj
          leftwalls.push(new CollisionBlock(x * 32, y * 32, 'red'));
        }
        
        //check for doors = 1502
        if (symbol == 1502) {
          // //push col obj
          rightwalls.push(new CollisionBlock(x * 32, y * 32, 'green'));
        }
        
        //check for obstacles = 1503
        if (symbol == 1503) {
          // //push col obj
          obstacles.push(new CollisionBlock(x * 32, y * 32, 'blue'));
        }
      });
    });
    
    
    const collisions = [leftwalls, rightwalls, obstacles]
    
    return collisions;
  };
  

  
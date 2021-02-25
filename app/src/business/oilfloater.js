/*
 * Author: bjiang
 * Create Time: 2021/2/24 10:47
 */

const LifeCycle = [20, 5, 100];
const breed = 6;

class Critter {
  // 构造函数
  constructor (state = 0, life = 0) {
    this.state = 0;
    this.life = 0;
  }

  next () {
    this.life++;
    if (this.life === LifeCycle[this.state]) {
      this.life = 0;
      this.state++;
    }
    if (this.state === 2 && this.life % breed === 0 && Math.random() < 0.66) {
      return true;
    }
  }

  spawn () {
    return new Critter();
  }
}

class Population {
  constructor (maxIntensive = 5) {
    this.maxIntensive = maxIntensive;
    this.intensive = [];
    this.free = [];
    this.die = [];
  }

  add (critter) {
    if (this.intensive.length < this.maxIntensive) {
      this.intensive.push(critter);
    } else {
      this.free.push(critter);
    }
  }

  deduce () {
    const eggs = [];
    this.intensive = this.intensive.filter(cri => {
      if (cri.next()) {
        eggs.push(cri.spawn());
      }
      if (cri.state < 3) return true;
      this.die.push(cri);
      return false;
    });
    this.free = this.free.filter(cri => {
      cri.next();
      if (cri.state < 3) return true;
      this.die.push(cri);
      return false;
    });
    eggs.forEach(egg => this.add(egg));
  }

  info () {
    const [egg, chd, adt, meat] = [].concat(this.intensive, this.free, this.die).reduce((p, { state }) => {
      p[state]++;
      return p;
    }, [0, 0, 0, 0]);
    return `蛋：${egg},幼虫：${chd},成虫：${adt},已死亡：${meat}`;
  }
}

const p = new Population();
p.add(new Critter());
for (let i = 0; i < 200; i++) {
  p.deduce();
  if (i % 10 === 0) {
    console.info(`现在是第${i}周期`, p.info());
  }
}

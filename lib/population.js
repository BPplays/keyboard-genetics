import Genome from "./genome";
import { QWERTY } from "./layout";

const POPULATION_SIZE = 10;

export default class Population {
  static random() {
    const base_genome  = Genome.fromLayout(QWERTY);
    const random_genes = [];

    for (let i=0; i < POPULATION_SIZE; i++) {
      random_genes.push(base_genome.mutate(20));
    }

    return new Population(random_genes);
  }

  constructor(genomes) {
    this.genomes = genomes;
    this.grades  = genomes.map(() => 0);
  }

  grade(fitness) {
    for (let i=0; i < this.genomes.length; i++) {
      this.grades[i] = fitness(this.genomes[i]);
    }
  }

  // using the tournament selection
  pickTwo() {
    const random_func = () => Math.random() > 0.5 ? 1 : Math.random() > 0.5 ? 0 : -1;
    const random_list = [].concat(this.genomes).sort(random_func);
    const random_half = random_list.slice(0, random_list.length / 2 | 0);
    const weighted    = this.sortByGrades(random_half);

    return weighted.slice(0, 2);
  }

  next(mutation_level) {
    const genomes = this.pickTwo();
    const first   = genomes[0];
    const second  = genomes[1];

    while (genomes.length < this.genomes.length) {
      genomes.push(first.mutate(mutation_level));
      genomes.push(second.mutate(mutation_level));
    }

    return new Population(genomes.slice(0, this.genomes.length));
  }

  best() {
    const best = this.sortByGrades(this.genomes)[0];
    return [best, this.gradeFor(best)];
  }

  sortByGrades(list) {
    return [].concat(list).sort((a, b) => {
      const grade_a = this.gradeFor(a);
      const grade_b = this.gradeFor(b);

      return grade_a > grade_b ? -1 : grade_a === grade_b ? 0 : 1;
    });
  }

  gradeFor(genome) {
    return this.grades[this.genomes.indexOf(genome)];
  }
}
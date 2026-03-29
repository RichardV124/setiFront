import { MutantService } from './mutant.service';

describe('MutantService - Pruebas del Algoritmo', () => {
  let service: MutantService;

  beforeEach(() => {
    service = new MutantService();
  });

  describe('isMutant', () => {
    it('debe detectar mutante con secuencias horizontales', () => {
      const dna = [
        "AAAA",
        "TCGT",
        "GCGT",
        "TTTT"
      ];
      expect(service.isMutant(dna)).toBe(true);
    });

    it('debe detectar mutante con secuencias verticales', () => {
      const dna = [
        "ATGC",
        "ACGT",
        "ACGT",
        "ACGT"
      ];
      expect(service.isMutant(dna)).toBe(true);
    });

    it('debe detectar mutante con secuencias diagonales', () => {
      const dna = [
        "ATGCGA",
        "CAGTGC",
        "TTATGT",
        "AGAAGG",
        "CCCCTA",
        "TCACTG"
      ];
      expect(service.isMutant(dna)).toBe(true);
    });

    it('debe retornar false para no mutante', () => {
      const dna = [
        "ATGCGA",
        "CAGTGC",
        "TTATTT",
        "AGACGG",
        "GCGTCA",
        "TCACTG"
      ];
      expect(service.isMutant(dna)).toBe(false);
    });

    it('debe retornar false para matriz pequeña sin mutantes', () => {
      const dna = [
        "ATGC",
        "CTAG",
        "GCAT",
        "TAGC"
      ];
      expect(service.isMutant(dna)).toBe(false);
    });

    it('debe retornar false para matriz menor a 4x4', () => {
      const dna = [
        "ATG",
        "CTA",
        "GCA"
      ];
      expect(service.isMutant(dna)).toBe(false);
    });
  });

  describe('validateDNA', () => {
    it('debe validar DNA correcto', () => {
      const dna = ["ATGC", "CGTA", "TACG", "GCTA"];
      const result = service.validateDNA(dna);
      expect(result.valid).toBe(true);
    });

    it('debe rechazar DNA con caracteres inválidos', () => {
      const dna = ["ATGC", "CGXA", "TACG", "GCTA"];
      const result = service.validateDNA(dna);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('A, T, C, G');
    });

    it('debe rechazar matriz no cuadrada', () => {
      const dna = ["ATGC", "CGT", "TACG", "GCTA"];
      const result = service.validateDNA(dna);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('cuadrada');
    });

    it('debe rechazar matriz menor a 4x4', () => {
      const dna = ["ATG", "CGT", "TAC"];
      const result = service.validateDNA(dna);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('4x4');
    });

    it('debe rechazar DNA vacío', () => {
      const dna: string[] = [];
      const result = service.validateDNA(dna);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('vacío');
    });
  });

  describe('findMutantSequences', () => {
    it('debe encontrar todas las secuencias mutantes', () => {
      const dna = [
        "AAAA",
        "TCGT",
        "GCGT",
        "TTTT"
      ];
      const sequences = service.findMutantSequences(dna);
      expect(sequences.length).toBeGreaterThanOrEqual(2);
    });

    it('debe retornar array vacío para no mutante', () => {
      const dna = [
        "ATGC",
        "CTAG",
        "GCAT",
        "TAGC"
      ];
      const sequences = service.findMutantSequences(dna);
      expect(sequences.length).toBe(0);
    });

    it('debe incluir información completa de cada secuencia', () => {
      const dna = [
        "AAAA",
        "TCGT",
        "GCGT",
        "TCGT"
      ];
      const sequences = service.findMutantSequences(dna);
      
      if (sequences.length > 0) {
        expect(sequences[0].positions).toBeDefined();
        expect(sequences[0].direction).toBeDefined();
        expect(sequences[0].base).toBeDefined();
        expect(sequences[0].positions.length).toBe(4);
      }
    });
  });

  describe('Casos específicos del ejemplo', () => {
    it('debe detectar el ejemplo mutante proporcionado en la prueba', () => {
      const dna = [
        "ATGCGA",
        "CAGTGC",
        "TTATGT",
        "AGAAGG",
        "CCCCTA",
        "TCACTG"
      ];
      
      expect(service.isMutant(dna)).toBe(true);
      
      const sequences = service.findMutantSequences(dna);
      expect(sequences.length).toBeGreaterThanOrEqual(2);
    });

    it('debe rechazar el ejemplo no mutante', () => {
      const dna = [
        "ATGCGA",
        "CAGTGC",
        "TTATTT",
        "AGACGG",
        "GCGTCA",
        "TCACTG"
      ];
      
      expect(service.isMutant(dna)).toBe(false);
    });
  });

  describe('Rendimiento', () => {
    it('debe ser eficiente con matrices grandes', () => {
      const dna = Array(10).fill(null).map(() => 
        Array(10).fill(null).map(() => 
          ['A', 'T', 'C', 'G'][Math.floor(Math.random() * 4)]
        ).join('')
      );
      
      const startTime = performance.now();
      service.isMutant(dna);
      const endTime = performance.now();
      
      // Debe completarse en menos de 10ms
      expect(endTime - startTime).toBeLessThan(10);
    });
  });
});

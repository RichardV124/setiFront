import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MutantService {

  // Detecta si un humano es mutante
  isMutant(dna: string[]): boolean {
    const n = dna.length;
    
    if (n < 4) return false;
    
    let sequencesFound = 0;
    
    // Función para verificar una secuencia en una dirección
    const checkSequence = (row: number, col: number, deltaRow: number, deltaCol: number): boolean => {
      // Verificar que no se salga de los límites
      if (row + deltaRow * 3 >= n || row + deltaRow * 3 < 0) return false;
      if (col + deltaCol * 3 >= n || col + deltaCol * 3 < 0) return false;
      
      const base = dna[row][col];
      
      // Verificar si los siguientes 3 caracteres son iguales
      for (let i = 1; i < 4; i++) {
        if (dna[row + deltaRow * i][col + deltaCol * i] !== base) {
          return false;
        }
      }
      return true;
    };
    
    // Recorrer la matriz
    for (let row = 0; row < n; row++) {
      for (let col = 0; col < n; col++) {
        
        // Buscar horizontal (derecha)
        if (col <= n - 4 && checkSequence(row, col, 0, 1)) {
          sequencesFound++;
          if (sequencesFound >= 2) return true;
        }
        
        // Buscar vertical (abajo)
        if (row <= n - 4 && checkSequence(row, col, 1, 0)) {
          sequencesFound++;
          if (sequencesFound >= 2) return true;
        }
        
        // Buscar diagonal descendente
        if (row <= n - 4 && col <= n - 4 && checkSequence(row, col, 1, 1)) {
          sequencesFound++;
          if (sequencesFound >= 2) return true;
        }
        
        // Buscar diagonal ascendente
        if (row >= 3 && col <= n - 4 && checkSequence(row, col, -1, 1)) {
          sequencesFound++;
          if (sequencesFound >= 2) return true;
        }
      }
    }
    
    return false;
  }

  // Valida que el ADN tenga el formato correcto
  validateDNA(dna: string[]): { valid: boolean; error?: string } {
    if (!dna || dna.length === 0) {
      return { valid: false, error: 'El ADN no puede estar vacío' };
    }

    const n = dna.length;
    
    // Verificar que sea una matriz cuadrada
    for (const row of dna) {
      if (row.length !== n) {
        return { valid: false, error: 'El ADN debe ser una matriz cuadrada (NxN)' };
      }
    }

    // Verificar que todas las celdas estén llenas
    for (let i = 0; i < dna.length; i++) {
      if (dna[i].length < n) {
        return { valid: false, error: 'Debes llenar todas las celdas de la matriz' };
      }
    }

    // Verificar que solo contenga A, T, C, G
    const validBases = /^[ATCG]+$/;
    for (const row of dna) {
      if (!validBases.test(row)) {
        return { valid: false, error: 'Todas las celdas deben tener A, T, C o G' };
      }
    }

    // Verificar tamaño mínimo
    if (n < 4) {
      return { valid: false, error: 'El ADN debe ser al menos de 4x4' };
    }

    return { valid: true };
  }

  // Encuentra todas las secuencias mutantes (para mostrar en la UI)
  findMutantSequences(dna: string[]): Array<{
    positions: Array<{ row: number; col: number }>;
    direction: string;
    base: string;
  }> {
    const n = dna.length;
    const sequences: Array<{
      positions: Array<{ row: number; col: number }>;
      direction: string;
      base: string;
    }> = [];
    
    const checkAndAddSequence = (
      row: number, 
      col: number, 
      deltaRow: number, 
      deltaCol: number, 
      direction: string
    ): boolean => {
      if (row + deltaRow * 3 >= n || row + deltaRow * 3 < 0) return false;
      if (col + deltaCol * 3 >= n || col + deltaCol * 3 < 0) return false;
      
      const base = dna[row][col];
      const positions: Array<{ row: number; col: number }> = [{ row, col }];
      
      for (let i = 1; i < 4; i++) {
        if (dna[row + deltaRow * i][col + deltaCol * i] !== base) {
          return false;
        }
        positions.push({ row: row + deltaRow * i, col: col + deltaCol * i });
      }
      
      sequences.push({ positions, direction, base });
      return true;
    };
    
    for (let row = 0; row < n; row++) {
      for (let col = 0; col < n; col++) {
        if (col <= n - 4) {
          checkAndAddSequence(row, col, 0, 1, 'horizontal');
        }
        if (row <= n - 4) {
          checkAndAddSequence(row, col, 1, 0, 'vertical');
        }
        if (row <= n - 4 && col <= n - 4) {
          checkAndAddSequence(row, col, 1, 1, 'diagonal-desc');
        }
        if (row >= 3 && col <= n - 4) {
          checkAndAddSequence(row, col, -1, 1, 'diagonal-asc');
        }
      }
    }
    
    return sequences;
  }
}
